export const siteData = [
  {
    site: "Site 1",
    area: "Area 1",
    demographics: {
      basic: {
        age: "25-34",
        gender: "Male",
        race: "White",
        religion: "Christianity",
      },
      purchaseBehavior: {
        shoppingFrequency: "Regular Shoppers",
        onlineVsOffline: "Online Shoppers",
        brandLoyalty: "Brand-Loyal Consumers",
      },
      mediaConsumption: {
        televisionHabits: "Streaming Service Subscribers",
        socialMediaUsage: "Heavy Social Media Users",
        podcastListenership: "Regular Podcast Listeners",
      },
    },
  },
  {
    site: "Site 1",
    area: "Area 2",
    demographics: {
      basic: {
        age: "35-44",
        gender: "Female",
        race: "Black/African American",
        religion: "Islam",
      },
      purchaseBehavior: {
        shoppingFrequency: "Occasional Shoppers",
        onlineVsOffline: "In-Store Shoppers",
        brandLoyalty: "Switchable Consumers",
      },
      mediaConsumption: {
        televisionHabits: "TV News Viewers",
        socialMediaUsage: "Occasional Social Media Users",
        podcastListenership: "Occasional Podcast Listeners",
      },
    },
  },
  {
    site: "Site 1",
    area: "Area 3",
    demographics: {
      basic: {
        age: "18-24",
        gender: "Non-Binary",
        race: "Asian",
        religion: "Hinduism",
      },
      purchaseBehavior: {
        shoppingFrequency: "Seasonal Shoppers",
        onlineVsOffline: "Omni-Channel Shoppers",
        brandLoyalty: "Brand-Loyal Consumers",
      },
      mediaConsumption: {
        televisionHabits: "Online TV Viewers",
        socialMediaUsage: "Non-Social Media Users",
        podcastListenership: "Casual Podcast Listeners",
      },
    },
  },
  {
    site: "Site 2",
    area: "Area 1",
    demographics: {
      basic: {
        age: "45-54",
        gender: "Male",
        race: "Hispanic/Latino",
        religion: "Catholicism",
      },
      purchaseBehavior: {
        shoppingFrequency: "Regular Shoppers",
        onlineVsOffline: "Online Shoppers",
        brandLoyalty: "Brand-Loyal Consumers",
      },
      mediaConsumption: {
        televisionHabits: "Cable TV Subscribers",
        socialMediaUsage: "Heavy Social Media Users",
        podcastListenership: "Regular Podcast Listeners",
      },
    },
  },
  {
    site: "Site 2",
    area: "Area 2",
    demographics: {
      basic: {
        age: "55+",
        gender: "Female",
        race: "White",
        religion: "Christianity",
      },
      purchaseBehavior: {
        shoppingFrequency: "Occasional Shoppers",
        onlineVsOffline: "In-Store Shoppers",
        brandLoyalty: "Switchable Consumers",
      },
      mediaConsumption: {
        televisionHabits: "Online TV Viewers",
        socialMediaUsage: "Occasional Social Media Users",
        podcastListenership: "Occasional Podcast Listeners",
      },
    },
  },
  {
    site: "Site 3",
    area: "Area 2",
    demographics: {
      basic: {
        age: "18-24",
        gender: "Female",
        race: "Asian",
        religion: "Christianity",
      },
      purchaseBehavior: {
        shoppingFrequency: "Regular Shoppers",
        onlineVsOffline: "Online Shoppers",
        brandLoyalty: "Brand-Loyal Consumers",
      },
      mediaConsumption: {
        televisionHabits: "Streaming Service Subscribers",
        socialMediaUsage: "Heavy Social Media Users",
        podcastListenership: "Regular Podcast Listeners",
      },
    },
  },
];

export const demographics = {
  basic: {
    age: ["18-24", "25-34", "35-44", "55+"],
    gender: ["Male", "Female"],
    race: [
      "Asian",
      "White",
      "Black/African American",
      "Hispanic/Latino",
      "Native American",
      "Other",
    ],
    religion: [
      "Christianity",
      "Islam",
      "Hinduism",
      "Buddhism",
      "Judaism",
      "Other/None",
    ],
  },
  [`purchase behavior`]: {
    [`shopping frequency`]: [
      "Regular Shoppers",
      "Occasional Shoppers",
      "Seasonal Shoppers",
    ],
    [`online vs offline`]: [
      "Online Shoppers",
      "In-Store Shoppers",
      "Omni-Channel Shoppers",
    ],
    [`brand loyalty`]: ["Brand-Loyal Consumers", "Switchable Consumers"],
  },
  [`media consumption`]: {
    [`television habits`]: [
      "Streaming Service Subscribers",
      "TV News Viewers",
      "Cable TV Subscribers",
    ],
    [`social media usage`]: [
      "Heavy Social Media Users",
      "Occasional Social Media Users",
      "Non-Social Media Users",
    ],
    [`podcast listenership`]: [
      "Regular Podcast Listeners",
      "Occasional Podcast Listeners",
      "Casual Podcast Listeners",
    ],
  },
};
