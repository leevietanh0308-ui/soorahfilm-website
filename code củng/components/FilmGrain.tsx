export default function FilmGrain({ disabled = false }: { disabled?: boolean }) { return disabled ? null : <div className="film-grain" aria-hidden="true" />; }
