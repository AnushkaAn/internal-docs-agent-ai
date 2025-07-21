import streamlit as st
from qa_engine import get_answer
from transformers.utils import cached_file
from huggingface_hub import snapshot_download

# Delete existing cache
import shutil
shutil.rmtree('~/.cache/huggingface', ignore_errors=True)


def main():
    st.set_page_config(page_title="Internal Docs Q&A Agent", layout="centered")
    st.title("📚 Internal Docs Q&A Agent")
    st.markdown("Ask any question about company policies, docs, or processes.")

    if "messages" not in st.session_state:
        st.session_state.messages = []

    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    if prompt := st.chat_input("Ask your question:"):
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        with st.spinner("Thinking..."):
            response = get_answer(prompt)
        
        with st.chat_message("assistant"):
            st.markdown(response)
        st.session_state.messages.append({"role": "assistant", "content": response})

if __name__ == "__main__":
    main()