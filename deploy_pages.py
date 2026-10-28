"""Собирает страницу для GitHub Pages в корень репозитория.

Как запускать (из корня репозитория):
    python konstruktor-zayavki/build.py   # сначала обычная сборка
    python deploy_pages.py                # затем публикация

Что делает:
  1. Берёт собранный konstruktor-zayavki/site/index.html.
  2. Встраивает hero.webp прямо в HTML (data-URI), чтобы страница была
     одним самодостаточным файлом.
  3. Оборачивает в полноценный документ с <!doctype html>: без доктайпа
     браузер включает quirks-режим и вёрстка разъезжается.
  4. Пишет результат в index.html в корне — GitHub Pages отдаёт именно его.
"""

import base64
import pathlib
import sys

ROOT = pathlib.Path(__file__).parent
SITE = ROOT / "konstruktor-zayavki" / "site"

SKELETON = """<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
</head>
<body>
{content}
</body>
</html>
"""


def main() -> int:
    src = SITE / "index.html"
    hero = SITE / "hero.webp"
    if not src.exists():
        print("Нет собранного site/index.html — сначала запустите build.py")
        return 1

    html = src.read_text(encoding="utf-8")

    uri = "data:image/webp;base64," + base64.b64encode(hero.read_bytes()).decode("ascii")
    html, n = html.replace('src="hero.webp"', f'src="{uri}"'), html.count('src="hero.webp"')
    if n != 1:
        print(f"Ожидалась 1 ссылка на hero.webp, найдено {n}")
        return 1

    out = ROOT / "index.html"
    out.write_text(SKELETON.format(content=html), encoding="utf-8")
    print(f"Готово: {out} ({out.stat().st_size} байт, картинка встроена)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
