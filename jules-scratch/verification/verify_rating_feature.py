from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Navega para a página inicial
        page.goto("http://localhost:3000/")

        # Aumenta o timeout geral da página
        page.set_default_timeout(15000)

        # Tira uma screenshot inicial para depuração
        page.screenshot(path="jules-scratch/verification/debug_homepage.png")
        print("Debug screenshot of homepage saved.")

        # Espera o primeiro card de receita aparecer
        first_recipe_card = page.locator("a[href*='/recipes/']").first
        expect(first_recipe_card).to_be_visible()

        # Clica no primeiro card de receita
        first_recipe_card.click()

        # Espera a página da receita carregar e o sistema de avaliação estar visível
        page.wait_for_url("**/recipes/**")
        rating_system = page.locator("div:has-text('Avaliações')").first
        expect(rating_system).to_be_visible(timeout=10000)

        # Tira a captura de tela
        page.screenshot(path="jules-scratch/verification/verification.png")

        print("Screenshot saved to jules-scratch/verification/verification.png")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error.png")


    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)