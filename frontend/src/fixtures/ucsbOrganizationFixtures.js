const ucsbOrganizationFixtures = {
  oneOrg: [
    {
      orgCode: "csu",
      orgTranslationShort: "CSU",
      orgTranslation: "UCSB Chinese Student Union",
      inactive: false,
    },
  ],

  threeOrgs: [
    {
      orgCode: "kasa",
      orgTranslationShort: "KASA",
      orgTranslation: "UCSB Korean American Student Association",
      inactive: false,
    },

    {
      orgCode: "tasa",
      orgTranslationShort: "TASA",
      orgTranslation: "UCSB Taiwanese American Student Association",
      inactive: true,
    },

    {
      orgCode: "vsa",
      orgTranslationShort: "VSA",
      orgTranslation: "UCSB Vietnamese Student Association",
      inactive: false,
    },
  ],
};

export { ucsbOrganizationFixtures };
