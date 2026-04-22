export const generateOtp = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

export const isEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export const isIndianPhone = (value) => {
  return /^[6-9]\d{9}$/.test(value);
};

export const resolveContact = (emailOrPhone) => {
  const value = String(emailOrPhone || "").trim();

  if (isEmail(value)) {
    return { method: "email", value };
  }

  if (isIndianPhone(value)) {
    return { method: "sms", value };
  }

  return null;
};

export const maskContact = (contact, method) => {
  if (method === "email") {
    const [name, domain] = contact.split("@");
    if (!name || !domain) return "***";
    const maskedName = `${name.slice(0, 1)}***`;
    return `${maskedName}@${domain}`;
  }

  if (contact.length < 4) return "****";
  return `${"*".repeat(contact.length - 4)}${contact.slice(-4)}`;
};
