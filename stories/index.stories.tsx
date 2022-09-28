import { Meta, Story } from "@storybook/react";
import { useState } from "react";
import { MechanicalCounter, MechanicalCounterProps } from "../src/index";

export default { title: "MechanicalCounter" } as Meta;

const Template: Story<MechanicalCounterProps> = (props) => {
  const { format } = new Intl.NumberFormat("en", { currency: "EUR" });
  const [text, set] = useState(1234567890);
  const [fontFamily, setFontFamily] = useState("system-ui");

  const onRandomNumber = () => {
    set(generateRandomNumber());
  };

  const onRandomFontFamily = () => {
    const nextFont = generateRandomFont();
    if (nextFont === fontFamily) {
      return onRandomFontFamily();
    }
    setFontFamily(nextFont);
  };

  return (
    <div
      style={{
        fontFamily,
        padding: 40,
      }}
    >
      <MechanicalCounter {...props} text={format(text)} key={fontFamily} />
      <button
        style={{ padding: 4, paddingLeft: 8, paddingRight: 8, marginTop: 16 }}
        onClick={onRandomNumber}
      >
        random text
      </button>
      <button
        style={{ padding: 4, paddingLeft: 8, paddingRight: 8, marginTop: 16 }}
        onClick={onRandomFontFamily}
      >
        random font
      </button>
      <p>
        <i>rendering {text}</i>
      </p>
    </div>
  );
};

const generateRandomFont = () => {
  const fonts = [
    "Arial",
    "Tangerine",
    "Verdana",
    "Inconsolata",
    "Helvetica",
    "'Droid Sans'",
    "'Passions Conflict'",
    "system-ui",
    "Comic Sans",
    "'Bungee Spice'"
  ];

  return fonts[Math.floor(Math.random() * fonts.length)];
};

const generateRandomNumber = () => {
  return parseFloat(
    String(Math.random())
      .split("")
      .slice(3, 7 + Math.floor(Math.random() * 4))
      .join("")
  );
};

export const Default = Template.bind({});
export const Height = Template.bind({});
Height.args = { height: `2em` };
export const HeightAsNumber = Template.bind({});
HeightAsNumber.args = { height: 30 };

export const WithPrefix = () => {
  const { format } = new Intl.NumberFormat("en", { currency: "EUR" });
  const [text, set] = useState(123456789);
  const onRandomNumber = () => {
    set(generateRandomNumber());
  };

  return (
    <div
      style={{
        fontFamily: `system-ui`,
        padding: 40,
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        EU€ <MechanicalCounter text={format(text)} />
      </div>
      <button
        style={{ padding: 4, paddingLeft: 8, paddingRight: 8, marginTop: 16 }}
        onClick={onRandomNumber}
      >
        random
      </button>
    </div>
  );
};

export const WithPrefixAndSuffix = () => {
  const { format } = new Intl.NumberFormat("en", { currency: "EUR" });
  const [text, set] = useState(123456789);
  const onRandomNumber = () => {
    set(generateRandomNumber());
  };

  return (
    <div
      style={{
        fontFamily: `system-ui`,
        padding: 40,
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        EU€
        <MechanicalCounter text={`${format(text)} total cost`} />
      </div>
      <button
        style={{ padding: 4, paddingLeft: 8, paddingRight: 8, marginTop: 16 }}
        onClick={onRandomNumber}
      >
        random
      </button>
    </div>
  );
};

export const WithChangeOfLocale = () => {
  const [text, set] = useState(123456789.42);
  const [locale, setLocale] = useState("en");
  const { format } = new Intl.NumberFormat(locale, { currency: "EUR" });
  const onRandomNumber = () => {
    set(generateRandomNumber() / 100);
  };
  const onChangeLocale = () => {
    setLocale(locale === "en" ? "nl" : "en");
  };

  return (
    <>
      <MechanicalCounter text={format(text)} />
      <button
        style={{ padding: 4, paddingLeft: 8, paddingRight: 8, marginTop: 16 }}
        onClick={onRandomNumber}
      >
        random
      </button>
      <button
        style={{
          padding: 4,
          paddingLeft: 8,
          paddingRight: 8,
          marginTop: 16,
          marginLeft: 8,
        }}
        onClick={onChangeLocale}
      >
        change locale
      </button>
    </>
  );
};
