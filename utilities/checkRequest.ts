export default (request: string) => {
  if (request.startsWith("אמרתי לך")) return "AMARTI LECHA";
  if (request === "הרשמה") return "REGISTER";
  if (request.startsWith("אני פחדן") || request.startsWith("אני פחדנית"))
    return "UNREGISTER";
  if (request === "שלום") return "WELCOME";

  return "HELP";
};
