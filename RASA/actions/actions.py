from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet, FollowupAction

QUESTIONS_DB = {
    "1": {
        "question": "Hvordan vil du bedømme dit helbred generelt af en skale fra 1-5, 5 som fremragende og 1 som dårligt.",
        "explanation": "Hvordan har du det i kroppen i din hverdag.",
        "answeroptions": 5
    },
    "2": {
        "question": "Begrænser dit helbred dig i at udføre moderate aktiviteter såsom at flytte et bord, støvsuge, bowle eller spille golf? Af en skala fra 1-3 hvor 3 er nej, slet ikke og 1 som meget begrænset",
        "explanation": "Rasa is an open-source machine learning framework for building AI-powered chatbots and voice assistants.",
        "answeroptions": 3
    },
    "3": {
        "question": "Begrænser dit helbred dig i at gå op ad flere etager af trapper? Af en skala fra 1-3 hvor 3 er nej, slet ikke og 1 som meget begrænset ",
        "explanation": "Når du laver dine daglige aktiviteter føler du at dit helbred gør så du ikke kan gøre den aktivitet",
        "answeroptions": 3
    },
    "4": {
        "question": "I de sidste 4 uger, hvor stor en del af tiden har du udrettet mindre, end du ville ønske, som følge af dit fysiske helbred? Fra 1-5 hvor 5 er på intet tidspunkt og 1 hele tiden.",
        "explanation": "Føler du at din helbred gør at komme op og ned af trapper er mere besværligt",
        "answeroptions": 5
    },
    "5": {
        "question": "I de sidste 4 uger, hvor stor en del af tiden har du været begrænset i hvilken slags arbejde eller andre aktiviteter, som følge af dit fysiske helbred? Fra 1-5 hvor 5 er på intet tidspunkt og 1 hele tiden.",
        "explanation": "In Rasa, an 'intent' represents the user's goal or intention behind their message.",
        "answeroptions": 5
},
    "6": {
        "question": "I de sidste 4 uger, hvor stor en del af tiden har du udrettet mindre, end du ville ønske, som følge af dit fysiske helbred? Fra 1-5 hvor 5 er på intet tidspunkt og 1 hele tiden.",
        "explanation": "Føler du at dit helbred har gjort så du har udnyttet mindre end du ville normalt",
        "answeroptions": 5
},
    "7": {
        "question": "I de sidste 4 uger, hvor stor en del af tiden har du udført dit arbejde eller andre aktiviteter mindre omhyggeligt end sædvanligt, som følge af dit fysiske helbred? Fra 1-5 hvor 1 er på intet tidspunkt og 5 hele tiden.",
        "explanation": "Har dit helbred påvirket hvor god du har været til at gøre dit arbejde som du plejer",
        "answeroptions": 5
    },
    "8": {
        "question": "I de sidste 4 uger, hvor meget har smerter vanskeliggjort dit normale arbejde? Fra 1-5 hvor 1 er på slet ikke og 5 Ekstremt meget.",
        "explanation": "Har smerter gjort dine hverdage mere vansklige når det kommer til daglig arbejde",
        "answeroptions": 5
    },
    "9": {
        "question": "I de sidste 4 uger, hvor stor en del af tiden har du følt dig rolig og fredfyldt? Fra 1-5 hvor 1 er på intet tidspunkt og 5 hele tiden.",
        "explanation": "Har du inden for den sidste tid følt at du har kunne slappe af og tage det roligt",
        "answeroptions": 5
    },
    "10": {
        "question": "I de sidste 4 uger, hvor stor en del af tiden havde du masser af energi? Fra 1-5 hvor 1 er på intet tidspunkt og 5 hele tiden.",
        "explanation": "Inden for den sidste tid har du haft godt med energi",
        "answeroptions": 5
    },
    "11": {
        "question": "I de sidste 4 uger, hvor stor en del af tiden har du følt dig nedtrykt og deprimeret? Fra 1-5 hvor 5 er på intet tidspunkt og 1 hele tiden." ,
        "explanation": "Har du haft problemer med at være nedtrykt eller deprimeret det sidste stykke tid",
        "answeroptions": 5
    },
    "12": {
        "question": "I de sidste 4 uger, hvor stor en del af tiden har dit fysiske helbred eller følelsesmæssige problemer vanskeliggjort dine sociale aktiviteter? Fra 1-5 hvor 5 er på intet tidspunkt og 1 hele tiden.",
        "explanation": "Har dine sociale aktiviteter blev påvirket af dit fysiske og psykiske helbred",
        "answeroptions": 5
    }
}

QUESTION_ORDER = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]

class ActionAskNextQuestion(Action):
    def name(self) -> Text:
        return "action_ask_next_question"

    def run(self, dispatcher: "CollectingDispatcher",
        tracker: Tracker,
        domain: Dict[Text,Any]) -> List[Dict[Text, Any]]:

        current_id = tracker.get_slot("conversation_id")
        next_id_to_ask = None

        if not current_id:
            if QUESTION_ORDER:
                next_id_to_ask = QUESTION_ORDER[0]
            else:
                dispatcher.utter_message(text="There are no questions loaded")
                return []
        else:
            try:
                current_index = QUESTION_ORDER.index(current_id)
                if current_index < len(QUESTION_ORDER) - 1:
                    next_id_to_ask = QUESTION_ORDER[current_index + 1]
                else:
                    dispatcher.utter_message(response="utter_qna_finished")
                    return [SlotSet("conversation_id", None)]
            except ValueError:
                dispatcher.utter_message(text="There was an issue finding the next questions. Let's start over.")
                if QUESTION_ORDER:
                    next_id_to_ask = QUESTION_ORDER[0]
                else:
                    dispatcher.utter_message(text="There are no questions loaded")
                    return []

        if next_id_to_ask and next_id_to_ask in QUESTIONS_DB:
            question_data = QUESTIONS_DB[next_id_to_ask]

            message_payload = {
                "type": "question",
                "id": next_id_to_ask,
                "text": question_data["question"],
                "answeroptions": question_data["answeroptions"]
            }
            dispatcher.utter_message(custom=message_payload)

            return [SlotSet("conversation_id", next_id_to_ask)]
        elif next_id_to_ask:
            dispatcher.utter_message(text= "Questions not found")
            return [SlotSet("conversation_id", None)]

        return []

class ActionExplainQuestions(Action):
    def name(self) -> Text:
        return "action_explain_question"

    def run(
        self,
        dispatcher: "CollectingDispatcher",
        tracker: Tracker,
        domain: Dict[Text,Any]) -> List[Dict[Text, Any]]:

        question_id_to_explain = tracker.get_slot("conversation_id")

        if not question_id_to_explain:
            dispatcher.utter_message(response="utter_which_question_to_explain")
            return []

        if question_id_to_explain in QUESTIONS_DB:
            explanation_text = QUESTIONS_DB[question_id_to_explain].get("explanation")
            if explanation_text:
                message_payload = {
                    "type": "explanation",
                    "id": question_id_to_explain,
                    "text": explanation_text
                }
                dispatcher.utter_message(custom=message_payload)

            else:
                dispatcher.utter_message(text=f"No explanation available")
        else:
            dispatcher.utter_message(text="No explanation found")

        return []