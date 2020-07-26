class JsString {
    /**
     * Capitalizes the first letter of the given string
     * @param {string} str: The string the first letter will be capitalized of.
     * @returns {string} The capitalized string.
     */
    static capitalizeFirstLetter(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Replaces the german special letters with the corresponding default translation
     */
    static replaceGermanSpecialLetters(str: string): string {
        let translations = {
            "ä": "ae",
            "ö": "oe",
            "ü": "ue",
            "ß": "ss",
            "Ä": "AE",
            "Ö": "OE",
            "Ü": "UE"
        };

        let ret = "";
        for (let idx = 0; idx < str.length; idx++)
            ret += (translations[str[idx]]) ? translations[str[idx]] : str[idx];

        return ret;
    }
}

export default JsString;