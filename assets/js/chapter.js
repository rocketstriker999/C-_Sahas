import { requestHelper } from './helper.js';

let chapterHandler = {};


chapterHandler.btnBack = document.getElementById("BTN_BACK");
chapterHandler.chapterName = document.getElementById("CHAPTER_NAME");
chapterHandler.chapterDescription = document.getElementById("CHAPTER_DESCRIPTION");
chapterHandler.containerTabs = document.querySelectorAll('.tab');
chapterHandler.containerChapterData = document.getElementById("CONTAINER_CHAPTER_DATA");


//extract and generate get object passed from dashboard
chapterHandler.chapter = Object.fromEntries(new URLSearchParams(window.location.search));

//set up details
chapterHandler.chapterName.innerHTML = chapterHandler.chapter.chap_name
chapterHandler.chapterDescription.innerHTML = chapterHandler.chapter.chap_sub_name

//Back Button Click
chapterHandler.btnBack.addEventListener("click", (e) => {
    window.electron.back();
});

//Tab click Handler
chapterHandler.containerTabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
        //Remove Active Class from all tab
        chapterHandler.containerTabs.forEach((tab) => {
            tab.classList.remove("active");
        })
        //add active class to selected tab only
        e.target.classList.add("active");

        //Clear the existing Demo Data
        chapterHandler.containerChapterData.innerHTML = "";

        switch (e.target.innerHTML) {

            case "Videos":
                chapterHandler.showVideos()
                break;

            case "Audios":
                chapterHandler.showAudios()
                break;

            case "PDFs":
                chapterHandler.showPDFs()
                break;

            case "Self Test":
                chapterHandler.showSelfTest()
                break;

        }
    });
});

chapterHandler.showNoDemoContentFound = () => {
    const noContentFound = document.createElement("p");
    noContentFound.classList.add("title_secondary");
    noContentFound.classList.add("padding_2");
    noContentFound.innerText = "No Content Found Here"
    chapterHandler.containerChapterData.appendChild(noContentFound)

}

chapterHandler.showVideos = () => {

    if (chapterHandler.videos && chapterHandler.videos.length > 0) {

        chapterHandler.videos.forEach(video => {

            const containerVideo = document.createElement("div");
            containerVideo.classList.add("container_content_item");

            //Image Of The Course
            const videoImage = document.createElement("img");
            videoImage.classList.add("content_item_image");
            videoImage.src = `http://img.youtube.com/vi/${video.vid_file}/0.jpg`;

            //container of video text
            const containerVideoInfo = document.createElement("div");
            containerVideoInfo.classList.add("container_content_item_info");

            //Video Title
            const videoTitle = document.createElement("p");
            videoTitle.classList.add("content_item_title");
            videoTitle.innerText = video.vid_name

            //Video Text
            const videoDescription = document.createElement("p");
            videoDescription.classList.add("margin_top");
            videoDescription.innerText = video.vid_desc

            //Adding text into video text container
            containerVideoInfo.appendChild(videoTitle)
            containerVideoInfo.appendChild(videoDescription)

            containerVideo.appendChild(videoImage);
            containerVideo.appendChild(containerVideoInfo);

            //Add Video To Container
            chapterHandler.containerChapterData.appendChild(containerVideo);

            //click handler
            containerVideo.addEventListener("click", (e) => {
                window.location.href = `videoPlayer.html?${new URLSearchParams(video).toString()}`;
            })

        });
    }
    else
        chapterHandler.showNoDemoContentFound()
}

chapterHandler.showPDFs = () => {
    if (chapterHandler.PDFs && chapterHandler.PDFs.length > 0) {

        chapterHandler.PDFs.forEach(pdf => {

            const containerPdf = document.createElement("div");
            containerPdf.classList.add("container_content_item");

            //Image Of The Course
            const pdfImage = document.createElement("img");
            pdfImage.classList.add("content_item_image");
            pdfImage.src = `../img/pdf.png`;

            //container of pdf text
            const containerPdfInfo = document.createElement("div");
            containerPdfInfo.classList.add("container_content_item_info");

            //pdf Title
            const pdfTitle = document.createElement("p");
            pdfTitle.classList.add("content_item_title");
            pdfTitle.innerText = pdf.pdf_name

            //pdf Text
            const pdfDescription = document.createElement("p");
            pdfDescription.classList.add("margin_top");
            pdfDescription.innerText = pdf.pdf_desc

            //Adding text into pdf text container
            containerPdfInfo.appendChild(pdfTitle)
            containerPdfInfo.appendChild(pdfDescription)

            containerPdf.appendChild(pdfImage);
            containerPdf.appendChild(containerPdfInfo);

            //Add pdf To Container
            chapterHandler.containerChapterData.appendChild(containerPdf);

            //click handler
            containerPdf.addEventListener("click", (e) => {
                window.location.href = `pdfPlayer.html?${new URLSearchParams(pdf).toString()}`;
            })

        });
    }
    else
        chapterHandler.showNoDemoContentFound()
}

chapterHandler.showAudios = () => {

    if (chapterHandler.audios && chapterHandler.audios.length > 0) {

        chapterHandler.audios.forEach(audio => {

            const containerAudio = document.createElement("div");
            containerAudio.classList.add("container_content_item");

            //Image Of The Course
            const audioImage = document.createElement("img");
            audioImage.classList.add("content_item_image");
            audioImage.src = `../img/audio.png`;

            //container of audio text
            const containerAudioInfo = document.createElement("div");
            containerAudioInfo.classList.add("container_content_item_info");

            //audio Title
            const audioTitle = document.createElement("p");
            audioTitle.classList.add("content_item_title");
            audioTitle.innerText = audio.aud_name

            //audio Text
            const audioDescription = document.createElement("p");
            audioDescription.classList.add("margin_top");
            audioDescription.innerText = audio.aud_desc

            //Adding text into audio text container
            containerAudioInfo.appendChild(audioTitle)
            containerAudioInfo.appendChild(audioDescription)

            containerAudio.appendChild(audioImage);
            containerAudio.appendChild(containerAudioInfo);

            //Add audio To Container
            chapterHandler.containerChapterData.appendChild(containerAudio);

            //click handler
            containerAudio.addEventListener("click", (e) => {
            })
        });
    }
    else
        chapterHandler.showNoDemoContentFound()
}

chapterHandler.showSelfTest = () => {
    let correctAnswersText = document.createElement('span');
    correctAnswersText.innerHTML = 'Correct Answers: 0%';

    if (chapterHandler.selfTest && chapterHandler.selfTest.length > 0) {
        let currentQuestionIndex = 0;
        let correctAnswersCount = 0;
        let remainingTime = chapterHandler.chapter.quiz_mins * 60; // Assuming quiz_mins is in minutes
        let selectedAnswer = null;
        let questionAnswered = false; // Flag to track if question has been answered
        let questionDisplayed = false; // Flag to track if question has been displayed initially

        const updateTimer = () => {
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;
            timeRemainingText.innerHTML = `Time remaining: ${minutes} Min ${seconds} Seconds`;
        };

        const startTimer = () => {
            updateTimer();
            const timerInterval = setInterval(() => {
                if (remainingTime > 0) {
                    remainingTime--;
                    updateTimer();
                } else {
                    clearInterval(timerInterval);
                    alert("Time's up!");
                    // Handle end of the quiz
                }
            }, 1000);
        };

        const loadQuestion = (questionIndex) => {
            const questionData = chapterHandler.selfTest[questionIndex];
            if (!questionData) {
                console.error(`Question data not found for index ${questionIndex}`);
                return;
            }

            console.log(`Loading question ${questionIndex + 1}: ${questionData.que_que}`);
            // Clear previous options
            questionDiv.innerHTML = '';


            questionText.innerHTML = `${questionIndex + 1}. ${questionData.que_que}`;

            questionDiv.appendChild(questionText);

            // Create and append new buttons for each option
            for (let i = 1; i <= 4; i++) {
                const optionKey = `que_o${i}`;
                if (questionData.hasOwnProperty(optionKey)) {
                    const button = document.createElement('button');
                    button.innerHTML = questionData[optionKey];
                    button.onclick = () => selectAnswer(button);
                    button.className = ''; // Reset button class
                    button.style.display = 'block'; // Ensure button is visible
                    questionDiv.appendChild(button);
                }
            }

            // Ensure submit button is displayed
            submitButton.style.display = 'block';

            // Enable option buttons for the new question
            enableOptionButtons();
        };

        const selectAnswer = (button) => {
            questionDiv.querySelectorAll('button').forEach(btn => btn.className = '');
            button.className = 'selected';
            selectedAnswer = button.innerHTML;
        };

        const handleAnswer = (selectedAnswer, correctAnswer) => {
            if (questionAnswered) return; // Prevent handling answer more than once
            questionAnswered = true;

            const buttons = questionDiv.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.innerHTML === selectedAnswer) {
                    if (selectedAnswer === correctAnswer) {
                        button.className = 'correct';
                        correctAnswersCount++;
                    } else {
                        button.className = 'incorrect';
                    }
                } else if (button.innerHTML === correctAnswer) {
                    button.className = 'correct';
                }
            });
            correctAnswersText.innerHTML = `Correct Answers: ${((correctAnswersCount / chapterHandler.selfTest.length) * 100).toFixed(2)}%`;

            // Display option description
            const currentQuestion = chapterHandler.selfTest[currentQuestionIndex];
            const optionDescription = document.createElement('div');
            optionDescription.className = 'option-description card';
            optionDescription.innerHTML = `Option Description: ${currentQuestion.que_ans_desc}`;
            optionDescription.style.fontSize = '16px'; // Match question font size
            optionDescription.style.fontWeight = 'bold'; // Make description bold
            questionContainer.appendChild(optionDescription);

            // Hide submit button and show next button
            submitButton.style.display = 'none';
            nextButton.style.display = 'block';

            // Disable option buttons after submitting answer
            disableOptionButtons();
        };

        const showFinalScore = () => {
            const scorePercentage = ((correctAnswersCount / chapterHandler.selfTest.length) * 100).toFixed(2); // Round to two decimal places
            const scorePopup = document.createElement('div');
            scorePopup.className = 'score-popup';
            scorePopup.innerHTML = `
            <div class="score-popup-content">
              <div class="score-image"></div>
              <h2>Complete</h2>
              <p>You have completed the Quiz, your score is ${scorePercentage}%</p>
              <button id="closeScorePopup" class="close-btn">Close</button>
            </div>
          `;

            document.body.appendChild(scorePopup);

            scorePopup.querySelector('.close-btn').onclick = () => {
                document.body.removeChild(scorePopup);
            };
        };

        // Function to disable all option buttons
        const disableOptionButtons = () => {
            questionDiv.querySelectorAll('button').forEach(button => {
                button.disabled = true;
            });
        };

        // Function to enable all option buttons
        const enableOptionButtons = () => {
            questionDiv.querySelectorAll('button').forEach(button => {
                button.disabled = false;
            });
        };

        const nextQuestion = () => {
            const optionDescription = document.querySelector('.option-description');
            if (optionDescription) {
                questionContainer.removeChild(optionDescription);
            }

            // Move to next question index
            currentQuestionIndex++;

            // Reset questionAnswered flag
            questionAnswered = false;

            // Check if there are more questions
            if (currentQuestionIndex < chapterHandler.selfTest.length) {
                // Load the next question
                loadQuestion(currentQuestionIndex);

                // Display submitButton again
                submitButton.style.display = 'block';
                nextButton.style.display = 'none';
            } else {
                // Quiz completed handling
                showFinalScore();
                // Additional handling if needed
            }
        };

        // Create main card
        const card = document.createElement('div');
        card.className = 'card';

        // Create and append chapter name div
        const chapterNameDiv = document.createElement('div');
        chapterNameDiv.className = 'chapter-name';
        const chapterNameIcon = document.createElement('i');
        chapterNameIcon.className = 'fas fa-book';
        const chapterNameText = document.createElement('span');
        chapterNameText.innerHTML = `Chapter Name: ${chapterHandler.chapter.chap_name}`;
        chapterNameDiv.appendChild(chapterNameIcon);
        chapterNameDiv.appendChild(chapterNameText);
        card.appendChild(chapterNameDiv);

        // Create and append quiz questions div
        const quizQuestionsDiv = document.createElement('div');
        quizQuestionsDiv.className = 'quiz-questions';
        const quizQuestionsIcon = document.createElement('i');
        quizQuestionsIcon.className = 'fas fa-question-circle';
        const quizQuestionsText = document.createElement('span');
        quizQuestionsText.innerHTML = `Total Questions: ${chapterHandler.selfTest.length}`;
        quizQuestionsDiv.appendChild(quizQuestionsIcon);
        quizQuestionsDiv.appendChild(quizQuestionsText);
        card.appendChild(quizQuestionsDiv);

        // Create and append correct answers div
        const correctAnswersDiv = document.createElement('div');
        correctAnswersDiv.className = 'correct-answers';
        const correctAnswersIcon = document.createElement('i');
        correctAnswersIcon.className = 'fas fa-check-circle';
        correctAnswersDiv.appendChild(correctAnswersIcon);
        correctAnswersDiv.appendChild(correctAnswersText); // Append correctAnswersText here
        card.appendChild(correctAnswersDiv);

        // Create and append time remaining div
        const timeRemainingDiv = document.createElement('div');
        timeRemainingDiv.className = 'time-remaining';
        const timeRemainingIcon = document.createElement('i');
        timeRemainingIcon.className = 'fas fa-clock';
        const timeRemainingText = document.createElement('span');
        timeRemainingText.innerHTML = `Time: ${chapterHandler.chapter.quiz_mins}`;
        timeRemainingDiv.appendChild(timeRemainingIcon);
        timeRemainingDiv.appendChild(timeRemainingText);
        card.appendChild(timeRemainingDiv);

        // Create and append start button
        const startButton = document.createElement('button');
        startButton.className = 'start-btn';
        startButton.innerHTML = 'Start';
        startButton.onclick = () => {
            document.getElementById('question-container').style.display = 'block';
            startTimer();
            loadQuestion(currentQuestionIndex);
            startButton.disabled = true; // Disable start button after starting
        };
        card.appendChild(startButton);

        // Append card to body
        document.body.appendChild(card);

        // Create question container
        const questionContainer = document.createElement('div');
        questionContainer.className = 'question-container';
        questionContainer.id = 'question-container';
        questionContainer.style.display = 'none';

        // Create and append question div
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        const questionText = document.createElement('p');
        questionDiv.appendChild(questionText);
        questionContainer.appendChild(questionDiv);

        // Create and append submit button
        const submitButton = document.createElement('button');
        submitButton.className = 'submit-btn';
        submitButton.innerHTML = 'SUBMIT';
        submitButton.onclick = () => {
            if (selectedAnswer) {
                handleAnswer(selectedAnswer, chapterHandler.selfTest[currentQuestionIndex].que_ans);
                selectedAnswer = null; // Reset selected answer after handling
            } else {
                alert("Please select an answer before submitting.");
            }
        };
        questionContainer.appendChild(submitButton);

        // Create and append next button
        const nextButton = document.createElement('button');
        nextButton.className = 'submit-btn';
        nextButton.innerHTML = 'NEXT';
        nextButton.style.display = 'none';
        nextButton.onclick = () => {
            nextQuestion();
        };
        questionContainer.appendChild(nextButton);

        //Add self test To Container
        chapterHandler.containerChapterData.appendChild(card);
        chapterHandler.containerChapterData.appendChild(questionContainer);

    } else {
        chapterHandler.showNoDemoContentFound();
    }
};

//Fetch Intially All Content
requestHelper.requestServer({
    requestPath: "getContent.php", requestMethod: "POST", requestPostBody: {
        chap_id: chapterHandler.chapter.chap_id,
    }
}).then(response => response.json()).then(jsonResponse => {
    //Put In Global Varibale To Access Later
    chapterHandler.videos = jsonResponse.vidData;
    chapterHandler.PDFs = jsonResponse.pdfData;
    chapterHandler.audios = jsonResponse.audData;
    chapterHandler.selfTest = jsonResponse.queData;
    //Select Video Defaultly
    chapterHandler.containerTabs[0].click();
});

