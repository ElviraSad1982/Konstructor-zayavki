"""
Сборка конструктора заявки.

Как запускать:
    python build.py

Что делает:
  1. Берёт исходники из папки site/ (app.js, body.tpl, head.tpl, memo.html, lab.html)
  2. Подставляет данные из папки data/ (catalog_final.json, env.json, tr_rows.json)
     в плейсхолдеры __FOOD__, __TR__, __ENV__ внутри app.js
  3. Собирает финальную страницу site/index.html — её можно открыть в браузере
     двойным кликом или опубликовать как Artifact в claude.ai

Папка data/ — только читается, никогда не трогаем.
Папка site/ — исходники и собранный index.html + app.built.js.
"""

import json
import re
import pathlib
import sys

ROOT = pathlib.Path(__file__).parent
SITE = ROOT / "site"
DATA = ROOT / "data"


def minify_json(obj) -> str:
    return json.dumps(obj, ensure_ascii=False, separators=(",", ":"))


def load_food():
    cat = json.loads((DATA / "catalog_final.json").read_text(encoding="utf-8"))
    for r in cat:
        # чистим «1. Наименование пробы: ...»
        r["name"] = re.sub(
            r"^(1\.\s*)?Наименование (пробы|образца):\s*[-–]?\s*",
            "",
            r["name"],
        ).strip()
        r["name"] = re.sub(r"^\d+\.\s+", "", r["name"])
    return [
        {
            "cat": r["cat"],
            "obj": r.get("obj", ["prod", "horeca"]),
            "name": r["name"],
            "nd": r["nd"],
            "decl": r["decl"],
            "vid": r.get("vid", "Микробиология"),
            "samp": r.get("samp", "ГОСТ 31904-2012"),
            "form": r.get("form", "Пищевая продукция"),
            "note": r.get("note", ""),
            "items": [
                {"ind": i["ind"], "meth": i["meth"], "norm": i["norm"]}
                for i in r["items"]
            ],
        }
        for r in cat
    ]


def load_tr():
    rows = json.loads((DATA / "tr_rows.json").read_text(encoding="utf-8"))
    keep = ("app", "grp", "ref", "ind", "line", "norm", "prod")
    return [{k: r[k] for k in keep} for r in rows]


def load_env():
    return json.loads((DATA / "env.json").read_text(encoding="utf-8"))


def main() -> int:
    print("1/4  Читаю исходники…")
    body = (SITE / "body.tpl").read_text(encoding="utf-8")
    head = (SITE / "head.tpl").read_text(encoding="utf-8")
    memo = (SITE / "memo.html").read_text(encoding="utf-8")
    lab = (SITE / "lab.html").read_text(encoding="utf-8")
    js = (SITE / "app.js").read_text(encoding="utf-8")

    print("2/4  Загружаю данные (catalog_final, env, tr_rows)…")
    food = load_food()
    tr = load_tr()
    env = load_env()
    print(f"       продуктов: {len(food)}, строк TR ТС: {len(tr)}, объектов env: {len(env)}")

    print("3/4  Собираю app.built.js и index.html…")
    js = (
        js.replace("__FOOD__", minify_json(food))
          .replace("__TR__",   minify_json(tr))
          .replace("__ENV__",  minify_json(env))
    )
    (SITE / "app.built.js").write_text(js, encoding="utf-8")

    body = body.replace("__MEMO__", memo).replace("__LAB__", lab)
    out = head + "\n" + body + "\n<script>\n" + js + "\n</script>\n"
    (SITE / "index.html").write_text(out, encoding="utf-8")

    print("4/4  Готово.")
    print(f"       Открывайте: {SITE / 'index.html'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
