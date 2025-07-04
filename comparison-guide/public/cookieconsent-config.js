CookieConsent.run({
    guiOptions: {
        consentModal: {
            layout: "box",
            position: "bottom left",
            equalWeightButtons: true,
            flipButtons: false
        },
        preferencesModal: {
            layout: "box",
            position: "right",
            equalWeightButtons: true,
            flipButtons: false
        }
    },
    categories: {
        necessary: {
            readOnly: true
        },
        functionality: {},
        analytics: {},
        marketing: {}
    },
    language: {
        default: "en",
        autoDetect: "browser",
        translations: {
            en: {
                consentModal: {
                    title: "Hello traveller, it's cookie time!",
                    description: "We use cookies to enhance your browsing experience, provide personalized content, and analyze our traffic. By clicking 'Accept all', you consent to our use of cookies.",
                    acceptAllBtn: "Accept all",
                    acceptNecessaryBtn: "Reject all",
                    showPreferencesBtn: "Manage preferences",
                    footer: "<a href=\"/privacy\">Privacy Policy</a>\n<a href=\"/imprint\">Imprint</a>"
                },
                preferencesModal: {
                    title: "Consent Preferences Center",
                    acceptAllBtn: "Accept all",
                    acceptNecessaryBtn: "Reject all",
                    savePreferencesBtn: "Save preferences",
                    closeIconLabel: "Close modal",
                    serviceCounterLabel: "Service|Services",
                    sections: [
                        {
                            title: "Cookie Usage",
                            description: "We use cookies to provide you with the best possible experience on our comparison guide website. Please choose which categories of cookies you consent to."
                        },
                        {
                            title: "Strictly Necessary Cookies <span class=\"pm__badge\">Always Enabled</span>",
                            description: "These cookies are essential for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt out of these cookies.",
                            linkedCategory: "necessary"
                        },
                        {
                            title: "Functionality Cookies",
                            description: "These cookies allow us to remember your preferences and provide enhanced features like personalized content and improved user experience on our comparison guide.",
                            linkedCategory: "functionality"
                        },
                        {
                            title: "Analytics Cookies",
                            description: "These cookies help us understand how visitors interact with our website by collecting anonymous information about usage patterns. This helps us improve our comparison guide and user experience.",
                            linkedCategory: "analytics"
                        },
                        {
                            title: "Advertisement Cookies",
                            description: "These cookies are used to deliver personalized advertisements that are relevant to you and your interests. They also help us measure the effectiveness of our advertising campaigns.",
                            linkedCategory: "marketing"
                        },
                        {
                            title: "More information",
                            description: "For any questions about our cookie policy and your privacy choices, please <a class=\"cc__link\" href=\"/contact\">contact us</a> or review our <a class=\"cc__link\" href=\"/privacy\">Privacy Policy</a>."
                        }
                    ]
                }
            }
        }
    },
    disablePageInteraction: true
});