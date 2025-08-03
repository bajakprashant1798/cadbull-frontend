export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-TX9TH7B'

export const pageview = (url) => {
  if (typeof window.dataLayer !== "undefined") {
    window.dataLayer.push({
      event: "pageview",
      page: url,
    })
  }
}
