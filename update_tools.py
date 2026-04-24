import os

# Dein GA4 und Verification Code
HEADER_SNIPPET = """
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-4JVNJKQYCG"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-4JVNJKQYCG');
    </script>
    <meta name="google-site-verification" content="ZwbquvhC72rPppjQTqD4b8wBaDw97MHKdKSgCG3LMXI" />
"""

def update_html_files():
    # Gehe durch alle Unterordner (deine Tools)
    for root, dirs, files in os.walk("."):
        for file in files:
            if file == "index.html" and root != ".": # Nur Tool-Indizes, nicht die Hauptseite
                file_path = os.path.join(root, file)
                
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Prüfen, ob der Code schon drin ist
                if "G-4JVNJKQYCG" not in content:
                    # Füge das Snippet direkt nach <head> ein
                    new_content = content.replace("<head>", "<head>" + HEADER_SNIPPET)
                    
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"✅ Updated: {file_path}")
                else:
                    print(f"⏭️ Already exists in: {file_path}")

if __name__ == "__main__":
    update_html_files()
