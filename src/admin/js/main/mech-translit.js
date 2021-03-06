// Translit char or string
function translit(string) {
    var trChar = {
        'А': 'a',
        'Б': 'b',
        'В': 'v',
        'Г': 'g',
        'Д': 'd',
        'Е': 'e',
        'Є': 'e',
        'Ж': 'j',
        'З': 'z',
        'І': 'i',
        'И': 'i',
        'Ї': 'yi',
        'Й': 'y',
        'К': 'k',
        'Л': 'l',
        'М': 'm',
        'Н': 'n',
        'О': 'o',
        'П': 'p',
        'Р': 'r',
        'С': 's',
        'Т': 't',
        'У': 'u',
        'Ф': 'f',
        'Х': 'h',
        'Ц': 'ts',
        'Ч': 'ch',
        'Ш': 'sh',
        'Щ': 'sch',
        'Ъ': '',
        'Ы': 'y',
        'Ь': '',
        'Э': 'e',
        'Ю': 'yu',
        'Я': 'ya',
        'а': 'a',
        'б': 'b',
        'в': 'v',
        'г': 'g',
        'д': 'd',
        'е': 'e',
        'ж': 'j',
        'з': 'z',
        'и': 'i',
        'і': 'i',
        'ї': 'yi',
        'й': 'y',
        'к': 'k',
        'л': 'l',
        'м': 'm',
        'н': 'n',
        'о': 'o',
        'п': 'p',
        'р': 'r',
        'с': 's',
        'т': 't',
        'у': 'u',
        'ф': 'f',
        'х': 'h',
        'ц': 'ts',
        'ч': 'ch',
        'ш': 'sh',
        'щ': 'sch',
        'ъ': 'y',
        'ы': 'y',
        'ь': '',
        'є': 'e',
        'э': 'e',
        'ю': 'yu',
        'я': 'ya',
        ' ': '-',
        '.': '',
        '/': '-',
        '_': '-',
    };

    var result = '';
    for (var i = 0; i < 126; i++) {
        var strChar = string.substr(i, 1);
        if (trChar[strChar]) {
            result += trChar[strChar];
        } else {
            result += strChar;
        }
    }
    return result.replace(/[^A-Za-z0-9_\-]/g, '').toLowerCase();
}