#!/usr/bin/env python3
"""Gera apresentação PDF (10 slides) — Quintal 127."""

from pathlib import Path

from fpdf import FPDF

ROOT = Path(__file__).resolve().parents[1]
LOGO = ROOT / "frontend" / "public" / "logo-quintal127.png"
OUTPUT = Path.home() / "Downloads" / "Quintal127_Apresentacao_Sistema.pdf"

BLUE = (13, 71, 161)
BLUE_DARK = (4, 29, 64)
LIME = (154, 205, 50)
WHITE = (255, 255, 255)
DARK = (30, 41, 59)
GRAY = (100, 116, 139)
LIGHT = (248, 250, 245)


class Deck(FPDF):
    def __init__(self):
        super().__init__(orientation="L", unit="mm", format="A4")
        self.set_auto_page_break(auto=False)
        self.slide_num = 0

    def bg(self, dark=False):
        self.set_fill_color(*(BLUE_DARK if dark else LIGHT))
        self.rect(0, 0, 297, 210, style="F")

    def header_slide(self, section, title, subtitle=None):
        self.slide_num += 1
        # faixa superior
        self.set_fill_color(*BLUE_DARK)
        self.rect(0, 0, 297, 32, style="F")
        # numero
        self.set_xy(250, 6)
        self.set_font("Helvetica", "B", 11)
        self.set_text_color(*LIME)
        self.cell(40, 6, f"{self.slide_num:02d}", align="R")
        # section
        self.set_xy(14, 6)
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(*LIME)
        self.cell(120, 6, section.upper())
        # titulo
        self.set_xy(14, 14)
        self.set_font("Helvetica", "B", 22)
        self.set_text_color(*WHITE)
        self.cell(0, 10, title, new_x="LMARGIN", new_y="NEXT")
        if subtitle:
            self.set_x(14)
            self.set_font("Helvetica", "", 11)
            self.set_text_color(200, 220, 255)
            self.cell(0, 6, subtitle, new_x="LMARGIN", new_y="NEXT")

    def bullets(self, items, x=14, y=42, w=268, size=11, gap=7):
        self.set_xy(x, y)
        for item in items:
            self.set_x(x)
            self.set_font("Helvetica", "", size)
            self.set_text_color(*DARK)
            self.multi_cell(w, gap, f"  -  {item}")
            self.ln(1)

    def two_cols(self, left_title, left_items, right_title, right_items, y=42):
        self.set_xy(14, y)
        self.set_font("Helvetica", "B", 12)
        self.set_text_color(*BLUE)
        self.cell(130, 7, left_title, new_x="LMARGIN", new_y="NEXT")
        self.bullets(left_items, x=14, y=y + 8, w=128, size=10, gap=6)

        self.set_xy(155, y)
        self.set_font("Helvetica", "B", 12)
        self.set_text_color(*BLUE)
        self.cell(130, 7, right_title, new_x="LMARGIN", new_y="NEXT")
        self.bullets(right_items, x=155, y=y + 8, w=128, size=10, gap=6)

    def highlight_box(self, text, y=155):
        self.set_fill_color(228, 249, 197)
        self.rect(14, y, 269, 22, style="F")
        self.set_xy(18, y + 5)
        self.set_font("Helvetica", "B", 11)
        self.set_text_color(77, 124, 15)
        self.multi_cell(261, 6, text)


def slide_cover(pdf):
    pdf.add_page()
    pdf.bg(dark=True)
    if LOGO.exists():
        pdf.image(str(LOGO), x=58, y=32, w=175)
    pdf.set_xy(0, 108)
    pdf.set_font("Helvetica", "B", 24)
    pdf.set_text_color(*LIME)
    pdf.cell(297, 10, "Sistema de Reserva de Quadras de Areia", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 14)
    pdf.set_text_color(*WHITE)
    pdf.cell(297, 8, "Quintal 127 - Arena & Choperia", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(297, 8, "Rua Laureano 127, Campeche - Florianopolis, SC", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(180, 200, 230)
    pdf.cell(297, 6, "APRESENTACAO TECNICA DO PROJETO", align="C")


def slide_end(pdf):
    pdf.add_page()
    pdf.bg(dark=True)
    if LOGO.exists():
        pdf.image(str(LOGO), x=78, y=45, w=135)
    pdf.set_xy(0, 138)
    pdf.set_font("Helvetica", "B", 30)
    pdf.set_text_color(*LIME)
    pdf.cell(297, 12, "Obrigado!", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 12)
    pdf.set_text_color(*WHITE)
    pdf.cell(297, 7, "Quintal 127 - Arena & Choperia", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(180, 200, 230)
    pdf.cell(297, 6, "Admin demo: admin@quadras.com / admin123", align="C")


def main():
    pdf = Deck()

    # 1 Capa
    slide_cover(pdf)

    # 2 O Projeto
    pdf.add_page()
    pdf.bg()
    pdf.header_slide("O Projeto", "Contexto e proposta de valor", "Quintal 127 - Arena & Choperia no Campeche")
    pdf.two_cols(
        "O negocio",
        [
            "Arena de quadras de areia e choperia em Florianopolis",
            "Reservas antes eram manuais (telefone/WhatsApp)",
            "Conflitos de agenda e falta de controle financeiro",
        ],
        "A solucao",
        [
            "Sistema web full-stack de ponta a ponta",
            "Cliente reserva e paga online pelo celular",
            "Admin gerencia quadras, agenda, pagamentos e NF",
        ],
    )
    pdf.highlight_box(
        "Em resumo: uma plataforma unica que digitaliza todo o ciclo de locacao de quadras do Quintal 127."
    )

    # 3 Briefing
    pdf.add_page()
    pdf.bg()
    pdf.header_slide("Briefing", "O que o cliente pediu", "Requisitos levantados junto ao Quintal 127")
    pdf.two_cols(
        "Cliente final",
        [
            "Ver quadras e precos",
            "Reservar sem ligar",
            "Cancelar com antecedencia",
            "Acompanhar pagamento e NF",
        ],
        "Administracao",
        [
            "Dashboard do negocio",
            "CRUD de quadras",
            "Controle de reservas e pagamentos",
            "Bloqueio de horarios",
        ],
    )
    pdf.bullets(
        [
            "Identidade visual Quintal 127 (logo, cores vivas, mobile)",
            "Interface simples, direta e acessivel pelo navegador",
        ],
        y=148,
        size=10,
    )

    # 4 Solucao + Stack
    pdf.add_page()
    pdf.bg()
    pdf.header_slide("A Solucao", "Plataforma desenvolvida", "Stack moderna e arquitetura em camadas")
    pdf.two_cols(
        "Tecnologia",
        [
            "Frontend: React, Vite, Tailwind, Zustand, Axios",
            "Backend: Node.js, Express, Prisma, JWT, bcrypt",
            "Banco relacional SQLite / PostgreSQL",
            "Validacao com Zod na API REST",
        ],
        "Entregas",
        [
            "Dois perfis: Cliente e Administrador",
            "Calculo automatico do valor da reserva",
            "Bloqueio de conflitos de horario",
            "Painel admin com metricas em tempo real",
        ],
    )

    # 5 Fluxo
    pdf.add_page()
    pdf.bg()
    pdf.header_slide("Fluxo de Reserva", "Da escolha ao pagamento confirmado")
    steps = [
        "1. Cliente escolhe quadra e data",
        "2. Sistema exibe horarios livres (08h as 22h)",
        "3. Reserva criada como Pendente",
        "4. Pagamento simulado: PIX, cartao ou dinheiro",
        "5. Status Confirmada + nota fiscal registrada",
    ]
    pdf.bullets(steps, y=44, size=12, gap=8)
    pdf.highlight_box(
        "Regras: sem sobreposicao de horarios | bloqueios respeitados | cancelamento com 24h | admin com controle total",
        y=150,
    )

    # 6 Experiencia Cliente
    pdf.add_page()
    pdf.bg()
    pdf.header_slide("Interface", "Jornada do cliente", "Telas principais do sistema")
    pdf.bullets(
        [
            "Home com identidade Quintal 127 e chamada para cadastro/login",
            "Cadastro e login seguros (JWT + bcrypt)",
            "Listagem de quadras com preco por hora e detalhes",
            "Escolha de data com disponibilidade em tempo real",
            "Minhas reservas: pagar, cancelar e acompanhar NF",
            "Layout responsivo para celular e desktop",
        ],
        y=44,
        size=11,
        gap=7,
    )

    # 7 Painel Admin
    pdf.add_page()
    pdf.bg()
    pdf.header_slide("Painel Admin", "Gestao completa do negocio")
    pdf.two_cols(
        "Dashboard",
        [
            "Total de reservas e reservas do dia",
            "Faturamento estimado",
            "Pendencias em destaque",
        ],
        "Operacoes",
        [
            "CRUD de quadras",
            "Filtros por data, status e quadra",
            "Pagamentos, NF e bloqueio de horarios",
        ],
    )

    # 8 Feedback
    pdf.add_page()
    pdf.bg()
    pdf.header_slide("Feedback", "Avaliacao dos clientes", "Nota 5/5 apos testes da plataforma")
    pdf.bullets(
        [
            '"Um site bem completo, com tudo que pedimos."',
            '"Muito facil de entender e usar."',
            '"Consegui reservar, cancelar e editar direitinho."',
            "Navegacao intuitiva | objetivo atingido no 1o acesso | zero erros relatados",
        ],
        y=44,
        size=11,
    )
    pdf.two_cols(
        "Pedidos atendidos",
        [
            "Logo oficial no sistema",
            "Endereco ao lado da logo",
            "Cores mais vivas (azul + verde limao)",
        ],
        "Status",
        [
            "Concluido",
            "Concluido",
            "Concluido",
        ],
        y=118,
    )

    # 9 Proximos passos
    pdf.add_page()
    pdf.bg()
    pdf.header_slide("Proximos Passos", "Evolucao do produto")
    pdf.bullets(
        [
            "Fotos reais das quadras e do espaco (maior confianca na reserva)",
            "Notificacoes automaticas por e-mail/WhatsApp (confirmacao e lembrete)",
            "Integracao com gateway de pagamento real (PIX/cartao)",
            "Avaliacao pos-jogo e relatorios avancados para o admin",
        ],
        y=44,
        size=12,
        gap=9,
    )

    # 10 Encerramento
    slide_end(pdf)

    pdf.output(str(OUTPUT))
    print(f"PDF gerado ({pdf.slide_num + 1} paginas): {OUTPUT}")


if __name__ == "__main__":
    main()
