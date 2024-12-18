import { KoreaTimeEnum } from "~/structure/type";

export function convertKoreaTime(
    date: Date,
    type: KoreaTimeEnum | undefined = undefined
): string {
    const convertedDate = new Date(date);

    convertedDate.setHours(convertedDate.getHours() + 9);

    const year = convertedDate.getFullYear();
    const month = String(convertedDate.getMonth() + 1).padStart(2, "0");
    const day = String(convertedDate.getDate()).padStart(2, "0");
    const hours = String(convertedDate.getHours()).padStart(2, "0");
    // const minutes = String(convertedDate.getMinutes()).padStart(2, "0");
    // const second = String(convertedDate.getSeconds()).padStart(2, "0");

    let formattedDate: string;

    if (type == KoreaTimeEnum.Day) {
        formattedDate = `${year}-${month}-${day}`;
    } else {
        formattedDate = `${year}-${month}-${day}-${hours}`;
    }

    return formattedDate;
}

export function convertReplacedText(text: string): string {
    return text
        .replace(/### (.+)/g, "<h2 class='text-2xl font-bold'>$1</h2>")
        .replace(/\n/g, "<br>")
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
}
