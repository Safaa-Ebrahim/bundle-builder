// Splits a title into its first word and the rest, for the two-tone
// "Cam Unlimited" style treatment used wherever product.highlightTitle is set.
export function splitHighlightTitle(title) {
  const [firstWord, ...rest] = title.split(' ')
  return [firstWord, rest.join(' ')]
}
