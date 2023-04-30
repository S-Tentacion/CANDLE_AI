const makeChatGPTCall = async (node, text) => {
  try {
    const apiKey = "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";
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${apiKey}`);

    const raw = JSON.stringify({
      model: "text-davinci-003",
      prompt: text,
      max_tokens: 2048,
      temperature: 0,
      top_p: 1,
      n: 1,
      stream: false,
      logprobs: null,
    });

    const requestHeaders = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    let response = await fetch(
      "https://api.openai.com/v1/completions",
      requestHeaders
    );
    response = await response.json();
    const { choices } = response;

    const responseText = choices[0].text.replace(/^\s+|\s+$/g, "");
    console.log(responseText, "responseText");
    node.textContent = responseText;
  } catch (err) {
    console.log("Oops! Error");
  }
};

const debounce = (fnc, del) => {
  let isDebounce;
  return function () {
    let context = this,
      args = arguments;
    clearTimeout(isDebounce);
    isDebounce = setTimeout(() => {
      fnc.apply(context, args);
    }, del);
  };
};

const getParsedText = (text) => {
  const parsed = /candle:(.*?)\;/gi.exec(text);
  return parsed ? parsed[1] : "";
};

function parseText() {
  const node = document.querySelector('[contenteditable="true"]');
  const { textContent } = node;
  const command = getParsedText(textContent);
  if (command) makeChatGPTCall(node, command);
}

const debounceParseText = debounce(parseText, 2000);

window.addEventListener("keypress", debounceParseText);

