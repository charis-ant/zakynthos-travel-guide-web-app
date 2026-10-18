/*IMAGE HOVER BOX*/
$(document).ready(function(){
    $('.icon > img').hover(function(e){
        var id = $(this).attr('id');
        var id_index = id.match(/\d+/);
        $(/image/.test(id)).each(function(){
            $('#box'+id_index).toggle(e.type == 'mouseenter');
        });
    });
    $(".extend").hover(function(){
        $(this).show();
    }, function(){
        $(this).hide();
    });
});

/*RESERVATIONS*/
$(document).ready(function(){
    $("#button-form-1").click(function () {
        var selected_value = $('.selection option:selected').val();
        var element = document.getElementById("clones");
        var new_element = document.getElementById("new-inputs");
    
        for (var i = 0; i < selected_value; i++) {
            new_element.appendChild(element.cloneNode(true));
        }
        $("#clones").css("display", "none");
        $(".hidden-1").css("display", "block");
        $("#button-form-1").css("display", "none");
        $("#form-1 h3").css("color", "gray");
        $("#form-1 input").attr('readonly', true);
        $('option').each(function() {
            if(!this.selected) {
                $(this).attr('disabled', true);
            }else{
                $(this).attr('selected', true);
            }
        });
    });

    $("#button-form-2").click(function () {
        $("#button-form-2").css("display", "none");
        $(".hidden-2").css("display", "block");
        $("#clones > input").attr('readonly', true);
        $("#forms-1-2 h3").css("color", "gray");
        $("#form-1-div").clone(true, true).appendTo("#final-form");
        $("#form-2-div").clone(true, true).appendTo("#final-form");
        $("#forms-1-2").css("display", "none");
    });
});

/*DAY PLANNER*/
$(document).ready(function(){
    // add new activity
    $("#add-items").click(function () {
        $("#clones").clone().appendTo("#input-items");
    });
});

/*VOICE SEARCH*/
window.philips = window.philips || {};
philips.speechToText = (() => {
    const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
    const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;

    // DOM elements
    const $searchText = document.querySelector('.input-field');
    const $microphone = document.querySelector('.input-field__microphone');
    const $button = document.querySelector('.input-field__button');
    /*
    * @description Set up all the proper variables / setting for SpeechRecognition.
    * @returns {object} - SpeechRecognitions 'recognition' object.
    * @example startListening();
    */

    const setUpSpeechRecognition = () => {
        // Products
        const products = [
        'airfryer',
        'avent',
        'blender',
        'erzatsteile',
        'hue',
        'lumea',
        'oneblade',
        'ontkalker',
        'padhouder',
        'senseo',
        'sonicare',
        'speedpro',
        'steamer',
        'toothbrush',
        'tv',
        'waterreservoir'
        ];

        // Speech Recognition
        const grammar = `#JSGF V1.0; grammar names; public <name> = ${products.join(' | ')} ;`;
        const recognition = new SpeechRecognition();
        const speechRecognitionList = new SpeechGrammarList();

        speechRecognitionList.addFromString(grammar, 1);
        recognition.grammars = speechRecognitionList;
        recognition.lang = 'en-GB';
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        return recognition;
    };

    /*
    * @description Start listening for user input.
    * @returns {void} - This function doesn't return anything.
    * @example startListening();
    */
    const startListening = () => {
        recognition = setUpSpeechRecognition();

        recognition.start();

        recognition.onresult = (event) => {
        const last = event.results.length - 1;
        const product = event.results[last][0].transcript;

        document.querySelector('#js-voice-output').setAttribute('value', product);

        // console.log(`Result received: ${product}.`);
        // console.log(`Confidence: ${event.results[0][0].confidence}`);
        // console.log(event);
        };

        recognition.onend = () => {
        $microphone.classList.remove('input-field__microphone--active');
        };

        recognition.onspeechend = () => {
        recognition.stop();
        };

        recognition.onnomatch = () => {
        console.log('I didn\'t recognise that.');
        };

        recognition.onerror = (event) => {
        console.log(`Error occurred in recognition: ${event.error}`);
        };
    };


    /*
    * @description Initialize the Speech to Text function.
    * @returns {void} - This function doesn't return anything.
    * @example initialize();
    */
    const initialize = () => {
        $microphone.classList.remove('input-field__microphone--hidden');
        $microphone.addEventListener('click', () => {
        $microphone.classList.add('input-field__microphone--active');
        // console.log('Ready to receive your command.');
        startListening();
        });

        
    };

    if (SpeechRecognition && SpeechGrammarList) {
        document.addEventListener('DOMContentLoaded', () => {
        initialize();
        });
    }
})();