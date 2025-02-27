const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default (emails) => {
  const invalidEmails = emails
    .split(",")
    .map((email) => email.trim())
    .filter((email) => !re.test(email)); // ✅ Correct usage

  return invalidEmails.length ? `These emails are invalid: ${invalidEmails.join(", ")}` : undefined;
};
