const splitRegex =
  /אמרתי לך\n([\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6})\n([0-9]{4}-[0-9]{2}-[0-9]{2})\n(.+)/;

export default (message: string) => {
  const match = message.match(splitRegex);
  if (!match) return null;
  let phoneNumber: string = "";
  if (match[1].startsWith("+")) {
    phoneNumber = "whatsapp:" + match[1].split("-").join("");
  } else if (match[1].startsWith("0")) {
    phoneNumber =
      "whatsapp:+972" + match[1].slice(1, match[1].length).split("-").join("");
  } else return null;

  return { phone: phoneNumber, date: match[2], content: match[3] };
};
