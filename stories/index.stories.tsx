import { Meta, Story } from "@storybook/react";
import { useState } from "react";
import { Ticker, TickerProps } from "../src/index";

export default { title: "Ticker " } as Meta;

const Template: Story<TickerProps> = (props) => {
  const { format } = new Intl.NumberFormat("en", { currency: "EUR" });
  const [text, set] = useState(1234567890);
  const onRandomNumber = () => {
    set(generateRandomNumber());
  };

  return (
    <div
      style={{
        fontFamily: `system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji'`,
        padding: 40,
      }}
    >
      <Ticker {...props} text={format(text)} />
      <button
        style={{ padding: 4, paddingLeft: 8, paddingRight: 8, marginTop: 16 }}
        onClick={onRandomNumber}
      >
        random
      </button>
    </div>
  );
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
    <>
      <Ticker text={"EU€ " + format(text)} />
      <button
        style={{ padding: 4, paddingLeft: 8, paddingRight: 8, marginTop: 16 }}
        onClick={onRandomNumber}
      >
        random
      </button>
    </>
  );
};

export const WithPrefixAndSuffix = () => {
  const { format } = new Intl.NumberFormat("en", { currency: "EUR" });
  const [text, set] = useState(123456789);
  const onRandomNumber = () => {
    set(generateRandomNumber());
  };

  return (
    <>
      <Ticker text={`EU€ ${format(text)} total cost`} />
      <button
        style={{ padding: 4, paddingLeft: 8, paddingRight: 8, marginTop: 16 }}
        onClick={onRandomNumber}
      >
        random
      </button>
    </>
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
      <Ticker text={format(text)} />
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
