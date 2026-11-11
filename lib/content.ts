// Everything printed on the box lives here, so the packaging can be
// re-skinned without touching the 3D code.
export const content = {
  heading: "Every package looks premium.",
  subheading: "Kraft drawer box, gold foil, velvet tray and a note from us, in every Jyarsh order.",
  scrollCue: "Scroll to open",
  why: {
    title: "Why Jyarsh",
    items: [
      { icon: "gemCheck", label: "Premium quality,\nyet affordable" },
      { icon: "crown", label: "Exclusive & trendy\ndesigns" },
      { icon: "shine", label: "Rich, lustrous\nfinish" },
      { icon: "leafHeart", label: "Skin friendly" },
      { icon: "smile", label: "Loved by 5000+\nhappy customers" },
      { icon: "gift", label: "Perfect for gifting" },
    ],
  },
  promises: [
    { icon: "shieldDrop", label: "Anti-tarnish,\nwaterproof" },
    { icon: "face", label: "Hypoallergenic,\nskin safe" },
    { icon: "bars", label: "18k gold\nplated" },
    { icon: "warranty", label: "6 month\nwarranty" },
  ],
  // the piece shown inside the box
  piece: { slug: "royal-green-heart-earrings", name: "Royal Green Heart Earrings", src: "/jewellery/royal-green-heart-earrings.webp" },
  card: {
    thanks: "Thank You",
    forChoosing: "for choosing",
    message: "We hope you love your purchase\nas much as we loved creating it",
  },
} as const;

export type IconName = (typeof content.why.items)[number]["icon"] | (typeof content.promises)[number]["icon"];
