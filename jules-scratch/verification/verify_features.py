from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()
    page.set_default_timeout(15000)

    try:
        # 1. Verificar a página de receitas e filtros
        print("Navigating to /recipes...")
        page.goto("http://localhost:3000/recipes")

        filter_panel = page.locator("div:has-text('Dificuldade')").first
        expect(filter_panel).to_be_visible()
        page.screenshot(path="jules-scratch/verification/01_recipes_page_with_filters.png")
        print("Screenshot 1: Filters panel is visible.")

        # 2. Aplicar um filtro e verificar o resultado
        print("Applying 'Fácil' difficulty filter...")
        page.get_by_role("button", name="Fácil").click()

        # Espera a URL mudar para incluir o searchParam
        expect(page).to_have_url(lambda url: 'difficulty=Fácil' in url)
        # Tira screenshot após o filtro ser aplicado
        page.screenshot(path="jules-scratch/verification/02_recipes_page_filtered.png")
        print("Screenshot 2: Page with filter applied.")

        # 3. Verificar a página de detalhes da receita e o sistema de avaliação
        print("Navigating to the first recipe...")
        first_recipe_card = page.locator("a[href*='/recipes/']").first
        expect(first_recipe_card).to_be_visible()
        first_recipe_card.click()

        page.wait_for_url("**/recipes/**")
        rating_system = page.locator("div:has-text('Avaliações')").first
        expect(rating_system).to_be_visible()
        page.screenshot(path="jules-scratch/verification/03_recipe_detail_with_rating.png")
        print("Screenshot 3: Rating system is visible on recipe page.")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error.png")
        # Levanta a exceção para que o script falhe se houver um erro
        raise

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)