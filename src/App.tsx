import { useEffect, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'

const repeatedDefaults = ['88', '104', '22']
const missingDefaults = ['12', '104', '7']

function getReviewScreenFromUrl() {
  if (typeof window === 'undefined') {
    return null
  }

  const rawValue = new URLSearchParams(window.location.search).get('screen')
  const parsedValue = Number(rawValue)

  if (!Number.isInteger(parsedValue) || parsedValue < 1 || parsedValue > 9) {
    return null
  }

  return parsedValue - 1
}

function clearReviewScreenParam() {
  if (typeof window === 'undefined') {
    return
  }

  const params = new URLSearchParams(window.location.search)

  if (!params.has('screen')) {
    return
  }

  params.delete('screen')
  const nextSearch = params.toString()
  const nextUrl = nextSearch ? `${window.location.pathname}?${nextSearch}` : window.location.pathname

  window.history.replaceState({}, '', nextUrl)
}

function App() {
  const reviewScreen = getReviewScreenFromUrl()
  const [screenIndex, setScreenIndex] = useState(reviewScreen ?? 0)
  const [name, setName] = useState(reviewScreen !== null && reviewScreen >= 1 ? 'Luan' : '')
  const [repeatInput, setRepeatInput] = useState(reviewScreen !== null && reviewScreen >= 2 ? '88' : '')
  const [missingInput, setMissingInput] = useState(reviewScreen !== null && reviewScreen >= 3 ? '12' : '')
  const [repeatedCards, setRepeatedCards] = useState<string[]>(
    reviewScreen !== null && reviewScreen >= 2 ? repeatedDefaults : [],
  )
  const [missingCards, setMissingCards] = useState<string[]>(
    reviewScreen !== null && reviewScreen >= 3 ? missingDefaults : [],
  )
  const [reviewMode, setReviewMode] = useState(reviewScreen !== null)

  useEffect(() => {
    if (screenIndex !== 4 || reviewMode) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setScreenIndex(5)
    }, 2000)

    return () => window.clearTimeout(timer)
  }, [reviewMode, screenIndex])

  const enterFlow = (nextScreen: number) => {
    setReviewMode(false)
    clearReviewScreenParam()
    setScreenIndex(nextScreen)
  }

  const goBack = () => {
    setReviewMode(false)
    clearReviewScreenParam()
    setScreenIndex((current) => Math.max(current - 1, 0))
  }

  const addRepeatedCard = () => {
    const value = repeatInput.trim() || '88'

    setRepeatedCards((current) => {
      if (current.length === 0) {
        return [value, '104', '22']
      }

      return Array.from(new Set([value, ...current]))
    })

    setRepeatInput('')
  }

  const addMissingCard = () => {
    const value = missingInput.trim() || '12'

    setMissingCards((current) => {
      if (current.length === 0) {
        return [value, '104', '7']
      }

      return Array.from(new Set([value, ...current]))
    })

    setMissingInput('')
  }

  const handleNameContinue = () => {
    setName((current) => current.trim() || 'Luan')
    enterFlow(2)
  }

  const handleRepeatedContinue = () => {
    if (repeatedCards.length === 0) {
      setRepeatedCards(repeatedDefaults)
    }

    enterFlow(3)
  }

  const handleSearch = () => {
    if (repeatedCards.length === 0) {
      setRepeatedCards(repeatedDefaults)
    }

    if (missingCards.length === 0) {
      setMissingCards(missingDefaults)
    }

    enterFlow(4)
  }

  const handleRestart = () => {
    setReviewMode(false)
    clearReviewScreenParam()
    setName('')
    setRepeatInput('')
    setMissingInput('')
    setRepeatedCards([])
    setMissingCards([])
    setScreenIndex(0)
  }

  return (
    <div className="app-shell">
      <section className="stage" aria-label="Jornada HappyRun">
        <PhoneShell
          onBack={goBack}
          showBack={[1, 2, 3, 5, 6, 7].includes(screenIndex)}
        >
          {screenIndex === 0 ? (
            <div className="screen screen--hook">
              <AppLogo />

              <div className="screen__hook-copy">
                <h2 className="screen__hero-title">
                  Encontre quem
                  <br />
                  tem suas
                  <br />
                  <span>figurinhas.</span>
                </h2>
                <span className="sr-only">Encontre quem tem suas figurinhas.</span>
                <p>Troque suas repetidas no Bandeiras.</p>
              </div>

              <TrophyGraphic />

              <ActionButton ariaLabel="comecar" onClick={() => enterFlow(1)}>
                COMEÇAR
                <ArrowIcon />
              </ActionButton>
            </div>
          ) : null}

          {screenIndex === 1 ? (
            <div className="screen screen--form screen--name">
              <AppLogo />

              <div className="screen__center-copy">
                <h2 className="screen__title">Como te chama?</h2>
                <div className="brush-line" aria-hidden="true"></div>

                <label className="sr-only" htmlFor="name-input">
                  Nome
                </label>
                <input
                  id="name-input"
                  className="phone-input phone-input--name"
                  value={name}
                  placeholder="Luan"
                  onChange={(event) => setName(event.target.value)}
                />
              </div>

              <ActionButton onClick={handleNameContinue}>CONTINUAR</ActionButton>
            </div>
          ) : null}

          {screenIndex === 2 ? (
            <div className="screen screen--form">
              <AppLogo />

              <div className="screen__stack">
                <div>
                  <h2 className="screen__title">
                    Digite <span className="accent">UMA</span> figurinha
                    <br />
                    repetida
                  </h2>
                  <span className="sr-only">Digite UMA figurinha repetida</span>
                  <div className="brush-line" aria-hidden="true"></div>
                </div>

                <label className="sr-only" htmlFor="repeat-input">
                  Figurinha repetida
                </label>
                <input
                  id="repeat-input"
                  className="phone-input phone-input--code"
                  inputMode="numeric"
                  value={repeatInput}
                  placeholder="88"
                  onChange={(event) => setRepeatInput(event.target.value.replace(/\D/g, ''))}
                />

                <ActionButton variant="green" onClick={addRepeatedCard}>
                  ADICIONAR
                </ActionButton>

                <ChipGroup label="Suas repetidas:" items={repeatedCards} />
              </div>

              <ActionButton onClick={handleRepeatedContinue}>CONTINUAR</ActionButton>
            </div>
          ) : null}

          {screenIndex === 3 ? (
            <div className="screen screen--form">
              <AppLogo />

              <div className="screen__stack">
                <div>
                  <h2 className="screen__title">
                    Digite <span className="accent">UMA</span> figurinha
                    <br />
                    que falta
                  </h2>
                  <span className="sr-only">Digite UMA figurinha que falta</span>
                  <div className="brush-line" aria-hidden="true"></div>
                </div>

                <label className="sr-only" htmlFor="missing-input">
                  Figurinha que falta
                </label>
                <input
                  id="missing-input"
                  className="phone-input phone-input--code"
                  inputMode="numeric"
                  value={missingInput}
                  placeholder="12"
                  onChange={(event) => setMissingInput(event.target.value.replace(/\D/g, ''))}
                />

                <ActionButton variant="green" onClick={addMissingCard}>
                  ADICIONAR
                </ActionButton>

                <ChipGroup label="Suas faltantes:" items={missingCards} />
              </div>

              <ActionButton ariaLabel="procurar trocas" onClick={handleSearch}>
                PROCURAR TROCAS
                <ArrowIcon />
              </ActionButton>
            </div>
          ) : null}

          {screenIndex === 4 ? (
            <div className="screen screen--searching">
              <AppLogo />

              <div
                className="screen__search-copy search-status"
                role="status"
                aria-live="polite"
                aria-label="Buscando trocas"
              >
                <h2 className="screen__title screen__title--search">
                  Procurando
                  <br />
                  pessoas...
                </h2>
                <span className="sr-only">Procurando pessoas...</span>

                <div className="search-loader" data-testid="search-loader" aria-hidden="true">
                  <span className="search-loader__glow"></span>
                  <span className="search-loader__scan"></span>
                  <span className="search-loader__dot search-loader__dot--one"></span>
                  <span className="search-loader__dot search-loader__dot--two"></span>
                  <span className="search-loader__dot search-loader__dot--three"></span>
                  <SearchGraphic />
                </div>

                <p className="search-status__caption">Cruzando repetidas e faltantes</p>

                <ul className="checks checks--loading" aria-label="Status da busca">
                  <li className="search-skeleton" data-testid="search-skeleton-row">
                    <CheckIcon />
                    <span>14 pessoas querem suas repetidas</span>
                  </li>
                  <li className="search-skeleton" data-testid="search-skeleton-row">
                    <CheckIcon />
                    <span>3 pessoas têm a 88</span>
                  </li>
                  <li className="search-skeleton" data-testid="search-skeleton-row">
                    <CheckIcon />
                    <span>Melhor troca encontrada</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : null}

          {screenIndex === 5 ? (
            <div className="screen screen--match">
              <AppLogo />

              <div className="screen__stack screen__stack--match">
                <div>
                  <h2 className="screen__title screen__title--tight">Achamos uma troca!</h2>
                </div>

                <div className="match-card">
                  <div className="match-card__person">
                    <AvatarGraphic />

                    <div>
                      <p className="match-card__name">
                        João
                      </p>
                      <p className="match-card__meta">Bandeiras Empresarial</p>
                    </div>
                  </div>

                  <div className="trade-grid">
                    <TradeBucket title="VOCÊ ENTREGA" stickers={['22', '88']} variant="yellow" />
                    <TradeBucket title="VOCÊ RECEBE" stickers={['12', '104']} variant="navy" />
                  </div>

                  <div className="match-card__compatibility">
                    Compatibilidade <strong>4x4</strong>
                  </div>
                </div>
              </div>

              <ActionButton ariaLabel="quero trocar" onClick={() => enterFlow(6)}>
                QUERO TROCAR
                <ArrowIcon />
              </ActionButton>
            </div>
          ) : null}

          {screenIndex === 6 ? (
            <div className="screen screen--meeting">
              <AppLogo />

              <div className="screen__stack screen__stack--meeting">
                <div>
                  <h2 className="screen__title screen__title--tight">
                    Encontre o João
                  </h2>
                </div>

                <MapGraphic />

                <div className="meeting-card">
                  <div className="meeting-card__row">
                    <MiniPinIcon />
                    <strong>Mesa 4</strong>
                  </div>
                  <div className="meeting-card__row meeting-card__row--muted">
                    <ClockIcon />
                    <span>Agora</span>
                  </div>
                </div>
              </div>

              <div className="screen__actions screen__actions--stacked">
                <ActionButton variant="green" ariaLabel="abrir whatsapp" onClick={() => enterFlow(6)}>
                  <WhatsAppIcon />
                  ABRIR WHATSAPP
                </ActionButton>
                <ActionButton variant="ghost" ariaLabel="ja encontrei" onClick={() => enterFlow(7)}>
                  JÁ ENCONTREI
                </ActionButton>
              </div>
            </div>
          ) : null}

          {screenIndex === 7 ? (
            <div className="screen screen--confirm">
              <AppLogo />

              <div className="screen__center-copy screen__center-copy--confirm">
                <h2 className="screen__title screen__title--tight">
                  Troca concluída?
                </h2>

                <div className="confirm-cards">
                  <Sticker number="22" variant="yellow" />
                  <SwapIcon />
                  <Sticker number="12" variant="navy" />
                </div>
              </div>

              <div className="screen__actions screen__actions--split">
                <ActionButton ariaLabel="sim" variant="green" onClick={() => enterFlow(8)}>
                  <CheckIcon />
                  SIM
                </ActionButton>
                <ActionButton ariaLabel="nao" variant="danger" onClick={() => enterFlow(6)}>
                  NÃO
                </ActionButton>
              </div>
            </div>
          ) : null}

          {screenIndex === 8 ? (
            <div className="screen screen--celebration">
              <AppLogo />

              <div className="screen__center-copy screen__center-copy--celebration">
                <div className="celebration-mark" aria-hidden="true">
                  <CheckIcon />
                </div>

                <h2 className="screen__title screen__title--tight screen__title--celebration">
                  +4 figurinhas
                  <br />
                  novas!
                </h2>

                <p className="celebration-copy">
                  Seu álbum está <strong>78%</strong> completo!
                </p>
              </div>

              <ActionButton onClick={handleRestart}>
                ENCONTRAR MAIS TROCAS
                <ArrowIcon />
              </ActionButton>
            </div>
          ) : null}
        </PhoneShell>
      </section>
    </div>
  )
}

type PhoneShellProps = {
  children: ReactNode
  showBack: boolean
  onBack: () => void
}

function PhoneShell({ children, showBack, onBack }: PhoneShellProps) {
  return (
    <div className="journey-shell">
      <div className="journey-surface">
        <div className="journey-column">
          {showBack ? (
            <button type="button" className="back-button" onClick={onBack} aria-label="Voltar">
              <ArrowIcon direction="left" />
            </button>
          ) : null}

          {children}
        </div>
      </div>
    </div>
  )
}

type ActionButtonProps = {
  children: ReactNode
  variant?: 'gold' | 'green' | 'ghost' | 'danger'
  ariaLabel?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

function ActionButton({
  children,
  variant = 'gold',
  ariaLabel,
  className,
  ...props
}: ActionButtonProps) {
  return (
    <button
      {...props}
      type="button"
      aria-label={ariaLabel}
      className={`action-button action-button--${variant}${className ? ` ${className}` : ''}`}
    >
      {children}
    </button>
  )
}

function ChipGroup({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="chip-group">
      <p>{label}</p>
      <div className="chip-group__items">
        {items.map((item) => (
          <span key={item} className="chip">
            <span>{item}</span>
            <span aria-hidden="true">×</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function TradeBucket({
  title,
  stickers,
  variant,
}: {
  title: string
  stickers: string[]
  variant: 'yellow' | 'navy'
}) {
  return (
    <div className="trade-bucket">
      <p className="trade-bucket__title">{title}</p>
      <div className="trade-bucket__stickers">
        {stickers.map((sticker) => (
          <Sticker key={sticker} compact number={sticker} variant={variant} />
        ))}
      </div>
    </div>
  )
}

function AppLogo() {
  return (
    <div className="logo" aria-label="Happy Run">
      <span className="logo__happy">HAPPY</span>
      <span className="logo__run">RUN</span>
      <span className="logo__sub">COPA DO MUNDO 2022</span>
    </div>
  )
}

function TrophyGraphic() {
  return (
    <div className="trophy" aria-hidden="true">
      <svg viewBox="0 0 140 196" role="presentation">
        <defs>
          <linearGradient id="trophy-gold" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#ffe680" />
            <stop offset="48%" stopColor="#d6a528" />
            <stop offset="100%" stopColor="#8d5b08" />
          </linearGradient>
        </defs>
        <path
          fill="url(#trophy-gold)"
          d="M78 12c17 4 30 18 30 36 0 14-8 27-20 34l6 18c6 17 8 35 5 52H42c-3-17-1-35 5-52l6-18C41 75 33 62 33 48c0-18 13-32 30-36l2 17c-8 2-13 10-13 19 0 10 7 18 17 20l6 2 6-2c10-2 17-10 17-20 0-9-5-17-13-19l2-17Z"
        />
        <path fill="#6f4300" opacity="0.28" d="M41 152h58v14H41z" />
        <path fill="#c99b1d" d="M51 165h38v16H51z" />
        <path fill="#845100" opacity="0.35" d="M46 181h48v9H46z" />
      </svg>
    </div>
  )
}

function SearchGraphic() {
  return (
    <div className="search-graphic" aria-hidden="true">
      <svg viewBox="0 0 180 180" role="presentation">
        <circle cx="76" cy="76" r="38" fill="none" stroke="#78d13d" strokeWidth="12" />
        <path
          d="m104 104 36 36"
          fill="none"
          stroke="#78d13d"
          strokeLinecap="round"
          strokeWidth="14"
        />
      </svg>
    </div>
  )
}

function AvatarGraphic() {
  return (
    <div className="avatar" aria-hidden="true">
      <svg viewBox="0 0 96 96" role="presentation">
        <defs>
          <linearGradient id="avatar-bg" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#ffd95c" />
            <stop offset="100%" stopColor="#2d9d3c" />
          </linearGradient>
        </defs>
        <circle cx="48" cy="48" r="46" fill="url(#avatar-bg)" />
        <circle cx="48" cy="34" r="16" fill="#ebc2a5" />
        <path fill="#1b1a1d" d="M32 62c5-10 13-15 16-15s11 5 16 15v12H32z" />
        <path fill="#34180f" d="M29 36c2-13 12-21 21-21s20 7 17 27c-4-6-11-10-19-10-7 0-13 2-19 4Z" />
      </svg>
    </div>
  )
}

function MapGraphic() {
  return (
    <div className="map-card" aria-hidden="true">
      <svg viewBox="0 0 280 162" role="presentation">
        <rect width="280" height="162" rx="18" fill="#8a8168" />
        <path d="M18 26 88 92" fill="none" stroke="#dad4c6" strokeWidth="18" />
        <path d="M96 10 160 72 234 18" fill="none" stroke="#ded9cb" strokeWidth="16" />
        <path d="M58 154 142 68 262 140" fill="none" stroke="#d5cebf" strokeWidth="18" />
        <path d="M138 28c-17 0-31 14-31 31 0 23 31 53 31 53s31-30 31-53c0-17-14-31-31-31Z" fill="#46b649" />
        <circle cx="138" cy="58" r="13" fill="#ffffff" />
      </svg>
    </div>
  )
}

function Sticker({
  number,
  variant,
  compact = false,
}: {
  number: string
  variant: 'yellow' | 'navy'
  compact?: boolean
}) {
  return (
    <div className={`sticker sticker--${variant} ${compact ? 'sticker--compact' : ''}`} aria-hidden="true">
      <span className="sticker__number">{number}</span>
      <div className="sticker__art">
        <div className="sticker__face"></div>
      </div>
    </div>
  )
}

function ArrowIcon({ direction = 'right' }: { direction?: 'left' | 'right' }) {
  return (
    <svg
      className={`icon-arrow icon-arrow--${direction}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
      role="presentation"
    >
      <path
        d={direction === 'left' ? 'M15 5 8 12l7 7' : 'm9 5 7 7-7 7'}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.6"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="icon-check" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
      <path
        d="m5 12 4 4 10-10"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.8"
      />
    </svg>
  )
}

function SwapIcon() {
  return (
    <svg className="icon-swap" viewBox="0 0 64 64" aria-hidden="true" role="presentation">
      <path
        d="M12 24h26l-6-6m20 22H26l6 6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="6"
      />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="icon-whatsapp" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
      <path
        d="M12 3a9 9 0 0 0-7.73 13.6L3 21l4.53-1.18A9 9 0 1 0 12 3Zm4.2 12.82c-.18.5-.96.92-1.33.98-.35.06-.81.09-1.32-.08-.31-.1-.72-.24-1.23-.46-2.16-.94-3.57-3.15-3.68-3.3-.11-.15-.87-1.16-.87-2.2 0-1.04.55-1.55.74-1.76.19-.21.42-.26.55-.26h.4c.13 0 .3-.05.47.35.18.42.61 1.45.66 1.56.05.11.08.24.02.39-.06.15-.09.24-.18.37-.09.13-.18.28-.26.37-.09.1-.18.2-.08.39.1.19.44.72.95 1.17.65.57 1.2.75 1.37.84.18.09.28.08.38-.05.1-.13.45-.53.57-.71.12-.18.24-.15.4-.09.17.06 1.07.5 1.25.59.18.09.3.13.34.2.04.08.04.44-.14.94Z"
        fill="currentColor"
      />
    </svg>
  )
}

function MiniPinIcon() {
  return (
    <svg className="icon-mini" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
      <path
        d="M12 3c-3.3 0-6 2.7-6 6 0 4.4 6 12 6 12s6-7.6 6-12c0-3.3-2.7-6-6-6Zm0 8.2A2.2 2.2 0 1 1 12 6.8a2.2 2.2 0 0 1 0 4.4Z"
        fill="currentColor"
      />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg className="icon-mini" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
      <path
        d="M12 2.8a9.2 9.2 0 1 0 0 18.4 9.2 9.2 0 0 0 0-18.4Zm.8 5v4.2l2.9 1.7-.8 1.4-3.7-2.2V7.8h1.6Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default App
