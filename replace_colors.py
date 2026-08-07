import os

files = [
    r'src\components\teacher-sidebar.tsx',
    r'src\components\teacher\lesson-editor.tsx',
    r'src\app\teacher\settings\page.tsx',
    r'src\app\teacher\page.tsx',
    r'src\app\teacher\submissions\page.tsx',
    r'src\app\teacher\lessons\page.tsx'
]

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        content = content.replace('#CE82FF', '#5E078A')
        content = content.replace('#B86EE6', '#4A0570')
        content = content.replace('#A86BD8', '#390457')
        content = content.replace('#F3E8FF', '#F4EAF9')
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f'Updated {f}')
    except Exception as e:
        print(f'Error updating {f}: {e}')
