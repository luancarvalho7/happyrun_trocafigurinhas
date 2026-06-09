import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('HappyRun trade journey', () => {
  afterEach(() => {
    vi.useRealTimers()
    window.history.pushState({}, '', '/')
  })

  it('starts on the hook screen', () => {
    const { container } = render(<App />)

    expect(screen.getByText(/encontre quem tem suas figurinhas/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /come[cç]ar/i })).toBeInTheDocument()
    expect(container.querySelector('.phone')).not.toBeInTheDocument()
    expect(container.querySelector('.journey-surface')).toBeInTheDocument()
  })

  it('shows an animated loader state with skeletons while searching', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)

    await user.click(screen.getByRole('button', { name: /come[cç]ar/i }))
    await user.click(screen.getByRole('button', { name: /continuar/i }))
    await user.click(screen.getByRole('button', { name: /continuar/i }))
    await user.click(screen.getByRole('button', { name: /procurar trocas/i }))

    expect(screen.getByRole('status', { name: /buscando trocas/i })).toBeInTheDocument()
    expect(container.querySelector('.search-loader')).toBeInTheDocument()
    expect(container.querySelectorAll('.search-skeleton')).toHaveLength(3)
  })

  it('walks through the trading flow to the completion screen', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: /come[cç]ar/i }))
    expect(screen.getByText(/como te chama\?/i)).toBeInTheDocument()

    await user.type(screen.getByLabelText(/nome/i), 'Luan')
    await user.click(screen.getByRole('button', { name: /continuar/i }))
    expect(screen.getByText(/digite uma figurinha repetida/i)).toBeInTheDocument()

    await user.type(screen.getByLabelText(/figurinha repetida/i), '88')
    await user.click(screen.getByRole('button', { name: /adicionar/i }))
    expect(screen.getByText(/^88$/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /continuar/i }))
    expect(screen.getByText(/digite uma figurinha que falta/i)).toBeInTheDocument()

    await user.type(screen.getByLabelText(/figurinha que falta/i), '12')
    await user.click(screen.getByRole('button', { name: /adicionar/i }))
    expect(screen.getByText(/^12$/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /procurar trocas/i }))
    expect(screen.getByText(/procurando pessoas/i)).toBeInTheDocument()

    expect(await screen.findByText(/achamos uma troca/i, {}, { timeout: 3500 })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /quero trocar/i }))
    expect(screen.getByText(/encontre o jo[aã]o/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /j[aá] encontrei/i }))
    expect(screen.getByText(/troca conclu[ií]da\?/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^sim$/i }))
    expect(screen.getByRole('heading', { name: /\+4 figurinhas\s*novas!/i })).toBeInTheDocument()
  }, 10000)

  it('supports direct review for a specific screen', () => {
    window.history.pushState({}, '', '/?screen=6')

    render(<App />)

    expect(screen.getByText(/achamos uma troca/i)).toBeInTheDocument()
    expect(screen.getByText(/jo[aã]o/i)).toBeInTheDocument()
  })

  it('uses a full-screen shell and shows loading skeletons on the search screen', () => {
    window.history.pushState({}, '', '/?screen=5')

    const { container } = render(<App />)

    expect(container.querySelector('.phone')).toBeNull()
    expect(container.querySelector('.journey-shell')).toBeInTheDocument()
    expect(screen.getByRole('status', { name: /buscando trocas/i })).toBeInTheDocument()
    expect(screen.getByTestId('search-loader')).toBeInTheDocument()
    expect(screen.getAllByTestId('search-skeleton-row')).toHaveLength(3)
  })
})