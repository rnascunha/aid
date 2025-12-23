import { v4 as uuidv4 } from "uuid";
import * as base from "./base";

const app_name = "chatbot",
  // session = "17bca9d1-4445-45b7-9ee5-10f935ab3e8b",
  session = uuidv4(),
  user = "rafaelo",
  question = "At Vitória, Brazil, what is the current weather?";
  // question = "At Vitória, Brazil, what is the best restaurant to go?";
  // question = "Is there aliens at other planets?";
  // question = "When Pedro Alvares Cabral discovered Brasil?";

async function initiateSessionA() {
  try {
    const response = await base.initiateSession({ app_name, user, session });
    console.dir(response, { maxArrayLength: null });
  } catch (e) {
    console.error(e);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function sendQueryA() {
  try {
    const response = await base.sendQuery({
      app_name,
      user,
      session,
      parts: [
        {
          text: question,
        },
      ],
      streaming: false,
      sse: true,
    });

    console.dir(response, { maxArrayLength: null, depth: null });
  } catch (e) {
    console.error(e);
  }
}

async function sendQuerySSE() {
  try {
    await base.sendQuerySSE({
      app_name,
      user,
      session,
      parts: [
        {
          text: question,
        },
      ],
      streaming: false,
      handler: (response) =>
        console.dir(response, { maxArrayLength: null, depth: null }),
    });
  } catch (e) {
    console.error(e);
  }
}

async function callF() {
  await initiateSessionA();
  // await initiateSessionA();
  // await sendQueryA();
  await sendQuerySSE();
}

callF();
