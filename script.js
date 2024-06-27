const form = document.querySelector("#apiForm"),
    apiToken = form.querySelector("#api_token"),
    method = form.querySelector("#method"),
    chatId = form.querySelector("#chat_id"),
    fromChatId = form.querySelector("#from_chat_id"),
    messageId = form.querySelector("#message_id"),
    replyToMessageId = form.querySelector("#reply_to_message_id"),
    text = form.querySelector("#text"),
    caption = form.querySelector("#caption"),
    photo = form.querySelector("#photo"),
    video = form.querySelector("#video"),
    documentInput = form.querySelector("#document"),
    disableWebPagePreview = form.querySelector("#disable_web_page_preview"),
    // alerts
    alertSuccess = document.querySelector("#alert-success"),
    alertDanger = document.querySelector("#alert-danger"),
    // select
    formSelect = form.querySelector("select"),
    inlineKeyboardsDiv = form.querySelector("#inline-keyboards");

formSelect.addEventListener("change", (e) => {
    const value = e.target.value;
    inlineKeyboardsDiv.innerHTML = "";
    for (let i = 0; i < value; i++) {
        const div = document.createElement("div");
        div.classList.add("inline-key");
        div.classList.add("form-group");
        div.innerHTML = `
            <label for="inline_text" class="text-light">Text</label>
            <input type="text" class="form-control" id="inline_text" name="inline_text">
            <label for="inline_url" class="text-light">URL</label>
            <input type="url" class="form-control" id="inline_url" name="inline_url">
            <hr></hr>
        `;
        inlineKeyboardsDiv.appendChild(div);
    }
});
if (localStorage.getItem("api_token")) {
    apiToken.value = localStorage.getItem("api_token");
}
method.value = "sendMessage";

form.addEventListener("submit", (e) => {
    const inlineKeyboards = document.querySelectorAll(".inline-key");

    const inlineKeys = [];
    inlineKeyboards.forEach((keyboard) =>
        inlineKeys.push([
            {
                text: keyboard.querySelector("#inline_text").value,
                url: keyboard.querySelector("#inline_url").value,
            },
        ]),
    );
    e.preventDefault();
    const data = {
        api_token: apiToken.value,
        method: method.value,
        chat_id: chatId.value,
        from_chat_id: fromChatId.value,
        message_id: messageId.value,
        reply_to_message_id: replyToMessageId.value,
        text: text.value,
        caption: caption.value,
        photo: photo.value,
        video: video.value,
        document: documentInput.value,
        disable_web_page_preview: disableWebPagePreview.checked,
        parse_mode: "HTML",
    };

    console.log(inlineKeys);
    fetch("https://api.telegram.org/bot" + data.api_token + "/" + data.method, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...data,
            reply_markup: {
                inline_keyboard: inlineKeys,
            },
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.ok) {
                alertSuccess.classList.remove("hide");
                alertSuccess.innerText = data.result.message_id;
                form.reset();
            } else {
                alertDanger.classList.remove("hide");
                alertDanger.innerText = data.description;
            }
        })
        .catch((error) => {
            alertDanger.classList.remove("hide");
            alertDanger.innerText = error;
        });
});
