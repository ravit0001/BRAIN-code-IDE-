

/* On document load */
$(document).ready(function (){

 $(".navbar a, footer a[href='#myPage']").on('click', function(event) {
  if (this.hash !== "") {

    event.preventDefault();
    var hash = this.hash;$('html, body').animate({
      scrollTop: $(hash).offset().top
    }, 3000, function(){

      window.location.hash = hash;
      });
}
  });



    /* default theme */
    var DEFAULT_THEME = "terminal";
    
    /*default mode */
    var DEFAULT_MODE = 'c_cpp';

    /*compile and run url */
    var COMPILE_AND_RUN_URL = '/compile-and-run/';
     
    /*Initial code in ace-editor */
    var INITIAL_CODE={};

    INITIAL_CODE['C']='#include <stdio.h>\n\nint main()\n{\n    printf("Hello World!");\n    return 0;\n}';
    INITIAL_CODE['CPP']='#include <iostream>\nusing namespace std;\n\nint main()\n{\n    cout << "Hello World!" << endl;\n    return 0;\n}';
    INITIAL_CODE['CPP11']='#include <iostream>\nusing namespace std;\n\nint main()\n{\n    cout << "Hello World!" << endl;\n    return 0;\n}';
    INITIAL_CODE['CLOJURE']='(println "Hello World!")';
    INITIAL_CODE['JAVA']='/* IMPORTANT: class must not be public. */\n\n/*\n * uncomment this if you want to read input.\nimport java.io.BufferedReader;\nimport java.io.InputStreamReader;\n*/\n\nclass TestClass {\n    public static void main(String args[] ) throws Exception {\n        /*\n         * Read input from stdin and provide input before running\n\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        int N = Integer.parseInt(line);\n        for (int i = 0; i < N; i++) {\n            System.out.println("hello world");\n        }\n        */\n\n        System.out.println("Hello World!");\n    }\n}';
    INITIAL_CODE['JAVASCRIPT']="print ('Hello World!')";
    INITIAL_CODE['HASKELL']='module Main\n  where\n\nmain=putStrLn "Hello World!\n"';
    INITIAL_CODE['PERL']="use strict;\n\n=comment\n# Read input from stdin and provide input before running code\n\n# Echo input to output.\nwhile(my $fred = <STDIN>) {\n    print $fred;\n}\n=cut\n\nprint 'Hello World!'";
    INITIAL_CODE['PHP']='<?php\n\n/*\n * Read input from stdin and provide input before running code\n\nfscanf(STDIN, "%s\n", $name);\necho "Hi, ".$name;\n\n*/\n\necho "Hello World!";\n\n\n?>';
    INITIAL_CODE['PYTHON']="'''\n# Read input from stdin and provide input before running code\n\nname = raw_input('What is your name?')\nprint 'Hi, %s.' % name\n'''\n\nprint 'Hello world'";
    INITIAL_CODE['RUBY']='# your code goes here';

    /* file extensions for languages*/
    var FILE_EXTENSIONS = {} ;

    FILE_EXTENSIONS['C']=".c";
    FILE_EXTENSIONS['CPP']=".cpp";
    FILE_EXTENSIONS['CPP11']=".cpp";
    FILE_EXTENSIONS['CLOJURE']=".clj";
    FILE_EXTENSIONS['JAVA']=".java";
    FILE_EXTENSIONS['JAVASCRIPT']=".js";
    FILE_EXTENSIONS['HASKELL']=".hs";
    FILE_EXTENSIONS['PERL']=".pl";
    FILE_EXTENSIONS['PHP']=".php";
    FILE_EXTENSIONS['PYTHON']=".py";
    FILE_EXTENSIONS['RUBY']=".rb";



// START OF ACE EDITOR INITIATION
    ace.require('ace/ext/language_tools');
    /* initiate  Ace editor */
    var editor=ace.edit("editor");
      
    /* default theme setup */
    editor.setTheme("ace/theme/"+DEFAULT_THEME);

    /* tabs spaces size  */
    editor.getSession().setTabSize(4);
    editor.setFontSize(16);

    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: false
    });

    /* default mode is c_cpp*/
    editor.getSession().setMode('ace/mode/'+DEFAULT_MODE);

    /* status-bar*/
    var StatusBar = ace.require("ace/ext/statusbar").StatusBar;
    // create a simple selection status indicator
    var statusBar = new StatusBar(editor, document.getElementById("bottom-to-editor"));

    /* initial code in editor */
    editor.setValue(INITIAL_CODE['C']);

// END OF ACE EDITOR INITIATION


    /* update content object */
    var update_content={};

    /* Change in theme event */
    $('#editor-theme').change(function () {

        var current_theme = $('#editor-theme').val();
        

        editor.setTheme("ace/theme/" + current_theme);

    });
   
    /* save code click event */
  /*  $('#save-code').click(function () {

        var editor_content = editor.getValue();
        var current_lang = $('#editor-lang').val();
        update_content[current_lang]= editor_content ;
        document.getElementById('save-code').className ="btn btn-success" ;

    });*/

    /* Language change event */
    $('#editor-lang').change(function () {

        var current_lang = $('#editor-lang').val();

        if( typeof update_content[current_lang] === 'undefined' ) {
            editor.setValue(INITIAL_CODE[current_lang]);
           // document.getElementById('save-code').className = "btn btn-info";
        }
        else {
            editor.setValue(update_content[current_lang]);
            //document.getElementById('save-code').className = "btn btn-success";
        }

        if(current_lang=='CPP11' || current_lang=='CPP' || current_lang == 'C') {
            editor.getSession().setMode('ace/mode/c_cpp');
        }

        editor.getSession().setMode('ace/mode/'+current_lang.toLowerCase());

    });

    /* download-code click event */
    $('#download-editor-code').click(function(){

        var editor_content = editor.getValue();
        var current_lang = $('#editor-lang').val();
        var file = new File([editor_content], "Untitled"+FILE_EXTENSIONS[current_lang], {type: "text/plain;charset=utf-8"});
        saveAs(file);

    });

    /* when custom input check is clicked */
   /* $('#custom-input-checkbox').click(function () {

        $('.custom-input-container').slideToggle();

    });*/

    /* Compile and Run click event */
    $("#compile-and-run").click(function() {

        /* when editor content is empty */
        if (editor.getValue() == "") {
            alert("Oops ! Nothing to Run .");
            return;
        }

        //noinspection JSJQueryEfficiency
        if ($('#compile-success').css('display') != 'none') {
            $('#compile-success').slideToggle();
        }

        //noinspection JSJQueryEfficiency
        if ($('#compile-failed').css('display') != 'none') {
            $('#compile-failed').slideToggle();
        }
        var csrf_token = $("input[name='csrfmiddlewaretoken']").val();
        /* Get content of editor */
        var editor_content = editor.getValue();
        /* Current language of editor */
        var current_lang = $('#editor-lang').val();
        
        /* Disable the button */
        $("#compile-and-run").prop("disabled", true);

        /* Check if custom input in checked or not */
        var custom_input = null;
        //if ($('#custom-input-checkbox').prop("checked") == true) {
            custom_input = document.getElementById("custom-input-textbox").value;
        //}

         //document.getElementById("demo").innerHTML = editor_content ;
        /* ready json of request */
        var request_data = {
            lang: current_lang,
            source: editor_content,
            input: custom_input,
            csrfmiddlewaretoken: csrf_token
        };
        console.log(request_data);
       
                    /* ajax request to server */
        $.ajax({
            url: "/compile-and-run/",
            data: request_data,
            type: 'POST',
            dataType: 'json',
            success: function (response) {
                if (response.compile_status == "OK") {
                    $('#output-success-pre').html(response.run_status.output_html);
                    if (custom_input) {
                        $('#input-success-pre').html(custom_input);
                    }
                    else {
                        $('#input-success-pre').html("Standard input is empty");
                    }
                    document.getElementById('memory').innerHTML = response.run_status.memory_used;
                    document.getElementById('status').innerHTML = response.run_status.status;
                    document.getElementById('time-to-run').innerHTML = response.run_status.time_used;
                    document.getElementById('share-link').innerHTML = response.web_link;
                    $('#compile-success').slideToggle();
                }
                else {
                    $('#compile-failed-pre').html(response.compile_status);
                    $('#output-failed-pre').html("Standard output is empty");
                    document.getElementById('share-link').innerHTML = response.web_link;
                    if (custom_input) {
                        $('#input-failed-pre').html(custom_input);
                    }
                    else {
                        $('#input-failed-pre').html("Standard input is empty");
                    }

                    document.getElementById('compile-failed-memory').innerHTML = 0;
                    document.getElementById('compile-failed-time').innerHTML = 0;
                    $('#compile-failed').slideToggle();
                }
                $('#compile-and-run').prop("disabled", false);
            },
            error: function () {
                alert(" Oops ! Server Could not Respond ! ");
                $('#compile-and-run').prop("disabled", false);
            }
        });
    });
    
});

