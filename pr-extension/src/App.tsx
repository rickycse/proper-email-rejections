import "./App.css"
import { useEffect, useState } from "react"

function App() {
  const [message, setMessage] = useState("")
  const [tab, setTab] = useState(1)
  const [loading, setLoading] = useState(false)
  const [errorText, setErrorText] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [_, setFileText] = useState("");
  const [submissionText, setSubmissionText] = useState(``)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileType = file.name.split(".").pop()?.toLowerCase();

    try {
      if (fileType === "pdf") {
        setFileText('')
      } else {
        setErrorText("Unsupported file type. Please upload a PDF file.");
      }
    } catch (error) {
      console.error("Error reading file:", error);
      setErrorText("Failed to read the file. Please try again.");
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSubmissionText(event.target.value); // Update the state as the user types
  };

  const handleTextSubmit = async () => {
    setErrorText("");
    const response = await fetch("http://localhost:8080/upload-submission", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ submissionText }),
    });
    if (response.status == 200){
      handleClearField()
      setSuccessMessage("Rejection message submitted successfully.")
    } else {
      setErrorText("Failed to submit rejection message. Please try again later.")
    }
  }

  const getMessage = async (text: string) => {
    const response = await fetch("http://localhost:8080/generate-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    })
    const data = await response.json()
    if (!data || !data[0] || !data[0].text) {
      setErrorText("Failed to retrieve rejection message")
      return ""
    } else {
      return data[0].text
    }
  }

  const handleClick = () => {
    setLoading(true)
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0]
      chrome.scripting
        .executeScript({
          target: { tabId: activeTab.id! },
          func: () => {
            const emailContainer = document.getElementsByClassName("ii gt")[0]
            return emailContainer ? emailContainer.textContent : ""
          },
        })
        .then(async (results) => {
          if (results && results[0] && results[0].result) {
            const emailContent = results[0].result.trim()
            const msg = await getMessage(emailContent)
            setMessage(msg)
            setErrorText("")
          } else {
            setErrorText("Failed to retrieve email content")
            setLoading(false)
          }
          setLoading(false)
        })
    })
  }

  useEffect(() => {
    if (message) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0]
        chrome.scripting.executeScript({
          target: { tabId: activeTab.id! },
          func: (message) => {
            const emailContainer = document.getElementsByClassName("ii gt")[0]
            const parentNode = emailContainer?.parentNode
            if (parentNode) {
              const emailContentElement = document.createElement("div")
              emailContentElement.style.whiteSpace = "pre-wrap"
              emailContentElement.style.marginTop = "8px"
              emailContentElement.style.font =
                "small/1.5 Arial,Helvetica,sans-serif"
              emailContentElement.textContent = message
              parentNode.appendChild(emailContentElement)
              parentNode.removeChild(emailContainer)
            }
          },
          args: [message],
        })
      })
      setSuccessMessage("Rejection email set successfully!")
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }
  }, [message])

  const handleClearField = () => {
    setSubmissionText(``)
  }

  const handleTabChange = (tab: number) => () => {
    setTab(tab)
  }

  return (
    <div className="p-4">
      <div className="flex justify-center m-2">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex gap-6" aria-label="Tabs">
            <a
              onClick={handleTabChange(0)}
              className="cursor-pointer shrink-0 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              Your Resume
            </a>

            <a
              onClick={handleTabChange(1)}
              className="cursor-pointer shrink-0 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              Publish
            </a>
          </nav>
        </div>
      </div>

      {tab === 0 ? (
        <div>
          <div className="flex items-center justify-center w-full my-2">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 w-[75%] text-center">
                  PDFs or DOXC files only. Max size 10MB. This feature is currently disabled.
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileUpload}
              />
            </label>
          </div>    
        </div>
      ) : (
        <div>
          <label htmlFor="OrderNotes" className="sr-only my-2">
            Order notes
          </label>
          <div className="overflow-hidden">
            <textarea
              id="OrderNotes"
              className="w-full resize-none border-x-0 border-t-0 border-gray-200 px-0 align-top sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              rows={12}
              placeholder={`Thanks but no thanks. Don't ever bother applying again or we'll rip your resume to shreds.`}
              value={submissionText}
              onChange={handleTextChange}
            ></textarea>

            <div className="flex items-center justify-end gap-2 py-3">
              <button
                type="button"
                onClick={handleClearField}
                className="cursor-pointer rounded-sm bg-gray-700 px-3 py-1.5 text-sm font-medium text-gray-100 hover:bg-gray-600"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={handleTextSubmit}
                className="cursor-pointer rounded-sm bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="progress-bar-container">
          <div className="progress-bar"></div>
        </div>
      )}

      <a
        className="cursor-pointer w-full inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:ring-3 focus:outline-hidden text-center"
        onClick={handleClick}
      >
        Generate
      </a>
      <p className="text-center text-red-500 dark:text-red-400 mt-2">
        {errorText}
      </p>
      <p className="text-center text-blue-500 dark:text-blue-400 mt-2">
        {successMessage}
      </p>

      <p className="text-center text-gray-500 dark:text-gray-400 mt-2">
        Want to write your own rejection emails? Click over to the Publish tab
        to get started!
      </p>
    </div>
  )
}

export default App
