import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.1:4',
  releaseNotes: {
    en_US: `- Set UI Password asks for confirmation when it would replace an existing password, and runs without asking when none is set yet.
- The Set UI Password result is shown in your language.`,
    es_ES: `- Establecer contraseña de la interfaz pide confirmación cuando reemplazaría una contraseña existente, y se ejecuta sin preguntar cuando aún no hay ninguna.
- El resultado de Establecer contraseña de la interfaz se muestra en su idioma.`,
    de_DE: `- „UI-Passwort festlegen“ fragt nach einer Bestätigung, wenn ein vorhandenes Passwort ersetzt würde, und läuft ohne Nachfrage, solange noch keines festgelegt ist.
- Das Ergebnis von „UI-Passwort festlegen“ wird in Ihrer Sprache angezeigt.`,
    pl_PL: `- „Ustaw hasło interfejsu” prosi o potwierdzenie, gdy zastąpiłoby istniejące hasło, i działa bez pytania, gdy żadne nie jest jeszcze ustawione.
- Wynik „Ustaw hasło interfejsu” jest wyświetlany w Twoim języku.`,
    fr_FR: `- Définir le mot de passe de l'interface demande une confirmation lorsqu'il remplacerait un mot de passe existant, et s'exécute sans demander tant qu'aucun n'est défini.
- Le résultat de Définir le mot de passe de l'interface s'affiche dans votre langue.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
