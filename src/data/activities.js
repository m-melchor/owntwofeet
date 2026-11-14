// The five activities in play order. Card art and words are used on Home, the activities page and each Next card.
export const ORDER = ['tools', 'budget', 'scams', 'call', 'laundry'];
// Card art in the page's language: the words inside the art come from the "acts.art" group (@left@, @av@, @biz@ below).
export const artOf = (id, t) => CARDS[id].art.replace('@left@', t('acts.art.left')).replace('@av@', t('acts.art.av')).replace('@biz@', t('acts.art.biz'));
export const GO_ICON = "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 12h14M13 6l6 6-6 6\"/></svg>";
export const CARDS = {
 "tools": {
  "art": "<span class=\"art\" style=\"background:radial-gradient(110% 80% at 50% 0%,#FBF8F2 0%,#ECE3D3 100%)\"><svg viewBox=\"0 0 520 300\" aria-hidden=\"true\"><g transform=\"translate(40 10)\"><use href=\"#t-hammer\" width=\"90\" height=\"270\"/></g><g transform=\"translate(120 20)\"><use href=\"#t-phillips\" width=\"80\" height=\"250\"/></g><g transform=\"translate(195 10)\"><use href=\"#t-tape\" width=\"100\" height=\"270\"/></g><g transform=\"translate(285 15)\"><use href=\"#t-wrench\" width=\"80\" height=\"260\"/></g><g transform=\"translate(360 20)\"><use href=\"#t-flat\" width=\"80\" height=\"250\"/></g><g transform=\"translate(430 5)\"><use href=\"#t-level\" width=\"80\" height=\"285\"/></g></svg></span>"
 },
 "budget": {
  "art": "<span class=\"art\" style=\"background:var(--butter)\"><svg viewBox=\"0 0 300 220\" aria-hidden=\"true\"><rect x=\"40\" y=\"40\" width=\"220\" height=\"140\" rx=\"22\" fill=\"#fff\"/><text x=\"64\" y=\"90\" font-family=\"Geist,system-ui,sans-serif\" font-size=\"13\" fill=\"#8A928D\">@left@</text><text x=\"64\" y=\"134\" font-family=\"Young Serif,Georgia,serif\" font-size=\"42\" fill=\"#16211C\">$6</text><rect x=\"64\" y=\"150\" width=\"172\" height=\"10\" rx=\"5\" fill=\"#EEEBE4\"/><rect x=\"64\" y=\"150\" width=\"130\" height=\"10\" rx=\"5\" fill=\"#2F6450\"/></svg></span>"
 },
 "scams": {
  "art": "<span class=\"art\" style=\"background:var(--sage)\"><svg viewBox=\"0 0 300 220\" aria-hidden=\"true\"><rect x=\"70\" y=\"24\" width=\"160\" height=\"180\" rx=\"28\" fill=\"#fff\"/><rect x=\"88\" y=\"56\" width=\"110\" height=\"34\" rx=\"16\" fill=\"#F6F4EF\"/><rect x=\"88\" y=\"100\" width=\"124\" height=\"44\" rx=\"16\" fill=\"#F2E2A6\"/><rect x=\"100\" y=\"114\" width=\"70\" height=\"6\" rx=\"3\" fill=\"#16211C\" opacity=\".5\"/><rect x=\"100\" y=\"126\" width=\"90\" height=\"6\" rx=\"3\" fill=\"#16211C\" opacity=\".3\"/><rect x=\"88\" y=\"156\" width=\"80\" height=\"26\" rx=\"13\" fill=\"#F6F4EF\"/></svg></span>"
 },
 "call": {
  "art": "<span class=\"art\" style=\"background:var(--mist)\"><svg viewBox=\"0 0 300 220\" aria-hidden=\"true\"><rect x=\"70\" y=\"24\" width=\"160\" height=\"180\" rx=\"28\" fill=\"#fff\"/><circle cx=\"150\" cy=\"70\" r=\"20\" fill=\"#F6F4EF\"/><text x=\"150\" y=\"76\" text-anchor=\"middle\" font-family=\"Geist,system-ui,sans-serif\" font-size=\"15\" font-weight=\"600\" fill=\"#56615B\">@av@</text><text x=\"150\" y=\"116\" text-anchor=\"middle\" font-family=\"Geist,system-ui,sans-serif\" font-size=\"15\" font-weight=\"600\" fill=\"#16211C\">@biz@</text><text x=\"150\" y=\"136\" text-anchor=\"middle\" font-family=\"Geist Mono,monospace\" font-size=\"12\" fill=\"#5F6B64\">1:12</text><circle cx=\"150\" cy=\"172\" r=\"15\" fill=\"#2F6450\"/><path d=\"M143 172h14\" stroke=\"#fff\" stroke-width=\"2.4\" stroke-linecap=\"round\"/></svg></span>"
 },
 "laundry": {
  "art": "<span class=\"art\" style=\"background:var(--sand)\"><svg viewBox=\"0 0 300 220\" aria-hidden=\"true\"><use href=\"#l-tshirt\" x=\"18\" y=\"14\" width=\"88\" height=\"88\"/><use href=\"#l-jeans\" x=\"106\" y=\"14\" width=\"88\" height=\"88\"/><use href=\"#l-bath\" x=\"194\" y=\"14\" width=\"88\" height=\"88\"/><use href=\"#l-bk-light\" x=\"20\" y=\"116\" width=\"84\" height=\"66\"/><use href=\"#l-bk-dark\" x=\"108\" y=\"116\" width=\"84\" height=\"66\"/><use href=\"#l-bk-towel\" x=\"196\" y=\"116\" width=\"84\" height=\"66\"/></svg></span>"
 }
};
