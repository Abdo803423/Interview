\documentclass[12pt,a4paper]{article}

% --- Core System Packages ---
\usepackage[utf8]{inputenc}
\usepackage{geometry}
\geometry{top=2.5cm, bottom=2.5cm, right=2cm, left=2cm}
\usepackage{amsmath}
\usepackage{amsfonts}
\usepackage{graphicx}
\usepackage{xcolor}
\usepackage{titlesec}
\usepackage{hyperref}
\usepackage{listings}
\usepackage[most]{tcolorbox}

% --- Professional Color Palette ---
\definecolor{brandblue}{HTML}{1A365D}
\definecolor{brandcyan}{HTML}{2B6CB0}
\definecolor{bgcode}{HTML}{F7FAFC}
\definecolor{borderbox}{HTML}{CBD5E0}
\definecolor{darkgreen}{HTML}{2F855A}
\definecolor{challengeorange}{HTML}{DD6B20}

% --- Typography & Heading Styles ---
\titleformat{\section}{\large\bfseries\color{brandblue}}{}{0em}{\filright}
\titleformat{\subsection}{\large\bfseries\color{brandcyan}}{}{0em}{\filright}

% --- Syntax Highlighting Configuration (HTML) ---
\lstset{
  language=HTML,
  backgroundcolor=\color{bgcode},
  basicstyle=\ttfamily\small\color{black},
  keywordstyle=\color{brandcyan}\bfseries,
  stringstyle=\color{darkgreen},
  commentstyle=\color{gray},
  numbers=none,
  tabsize=2,
  breaklines=true,
  showstringspaces=false,
  frame=single,
  rulecolor=\color{borderbox},
  frameround=tttt,
  xleftmargin=10pt,
  xrightmargin=10pt
}

% --- Custom Structural Component Boxes ---
\newtcolorbox{challengebox}[1]{
  colback=orange!5,
  colframe=challengeorange,
  fonttitle=\bfseries\color{white},
  title=#1,
  boxrule=1.5pt,
  arc=5pt
}

% --- Document Metadata ---
\title{\Huge\bfseries\color{brandblue} HTML Complete Course Architecture}
\author{\Large From Absolute Beginner to Professional Level}
\date{\the\year}

% ----------------------------------------------------
%                      DOCUMENT START
% ----------------------------------------------------
\begin{document}

\maketitle
\tableofcontents
\newpage

% ====================================================
%                     LESSON 1
% ====================================================
\section{🚀 Lesson 1: Beginner Level (What is HTML \& Tags?)}

\subsection{1. Core Concept}
Imagine writing a standard document in Microsoft Word. To turn a piece of text into a heading, you manually increase its size and make it bold. A web browser (like Google Chrome), however, cannot understand visual context on its own. It requires structured semantic code to declare: "This specific text is a primary heading," and "This text is a standard paragraph."\\
\textbf{HTML (HyperText Markup Language)} is the specialized communication syntax we use to talk to browsers, defining the exact structural identity and functional role of every component on a web page.

\subsection{2. Physical \& Spatial Analogy}
In the physical world, constructing a room requires placing concrete blocks at the absolute start and end points to securely define its spatial boundaries.\\
HTML \textbf{Tags} serve as "digital building blocks" or structural containers. Every container features a distinct entry point and an exit point. Any content nested within this container instantly inherits its structural properties and physiological attributes on the screen (e.g., a heading container exponentially inflates the font size, while a button container transforms a text block into a clickable interface element).

\subsection{3. Structural \& Mathematical Breakdown (Tag Anatomy)}
Mathematically, an HTML element is modeled as a closed, deterministic function that initializes via an opening delimiter and resolves via a closing delimiter.\\
Any \textbf{Element} in HTML consists of three fundamental parts:

$$\text{Element} = \text{[Opening Tag]} + \text{Content} + \text{[Closing Tag]}$$

\begin{itemize}
    \item \textbf{Opening Tag:} Defines the element name wrapped in angle brackets: \lstinline|<tag>|.
    \item \textbf{Content:} The raw data, text, or nested media targeted for rendering to the end-user.
    \item \textbf{Closing Tag:} Identical to the opening tag but includes a forward slash \lstinline|</tag>|, signaling to the browser parser that this structural scope is now closed.
\end{itemize}

\subsection{4. Step-by-Step Practical Implementation}
Let us dissect a standard, compliant HTML document structure piece by piece:

\begin{lstlisting}
<!DOCTYPE html>
<html>
  <head>
    <title>Test Page</title>
  </head>
  <body>
    <h1>Welcome, My Friend</h1>
    <p>This line represents a standard paragraph element.</p>
  </body>
</html>
\end{lstlisting}

\textbf{Comprehensive Component Breakdown:}
\begin{description}
    \item[\lstinline|<!DOCTYPE html>|:] A document type declaration. It is an instruction telling the browser to parse the document using the modern HTML5 standard.
    \item[\lstinline|<html>| and \lstinline|</html>|:] The root element (the parent container). All other functional page code must live inside this tag.
    \item[\lstinline|<head>| and \lstinline|</head>|:] The metadata container. It holds background instructions not rendered on the main page canvas, such as SEO parameters, stylesheets, and document titles.
    \item[\lstinline|<title>| and \lstinline|</title>|:] Defines the document title displayed directly in the browser's tab bar.
    \item[\lstinline|<body>| and \lstinline|</body>|:] The viewport container. Everything written here is what the user visually interacts with on the page canvas (text, multimedia, controls).
    \item[\lstinline|<h1>| and \lstinline|</h1>|:] Heading Level 1. This represents the most important, structurally heavy heading on the page.
    \item[\lstinline|<p>| and \lstinline|</p>|:] Paragraph element. Used to contain standard flowing body text.
\end{description}

\begin{challengebox}{🎯 Hands-On Challenge (Task 1)}
Open a plaintext editor like Notepad or VS Code and write the boilerplate code block above exactly as shown. Modify the text inside the \lstinline|<h1>| container to display your full name. Verify that every open tag is properly resolved with a closing slash. Save the file exactly as \lstinline|index.html| and launch it inside your web browser to view your live execution.
\end{challengebox}


% ====================================================
%                     LESSON 2
% ====================================================
\newpage
\section{💡 Lesson 2: Intermediate Level (Hyperlinks \& Multimedia)}

\subsection{1. Core Concept}
Static text structures alone do not make the modern web. To build a true network, we must discover how to link independent pages together and incorporate media. Web browsers utilize highly specialized tags to distinguish between basic text content and active "gateways" that route users to external URLs or pull external assets into the document flow.

\subsection{2. Physical \& Spatial Analogy}
Physically, hyperlinks act as direct "bridges or tunnels" connecting two entirely separate geographical islands. Images, however, work differently. Because HTML text files are incredibly lightweight, image files are never injected directly inside the raw code file. Instead, the image tag acts as an embedded "holographic window" pointing to a file stored elsewhere on a local drive or across the web, dynamically rendering it on screen.

\subsection{3. Mathematical Breakdown \& Attributes}
To control these complex components, we introduce a crucial structural property: \textbf{Attributes}. A plain tag is often insufficient on its own; telling a browser to simply "create a link" prompts the logical question: "Where does this link go?". Attributes append vital metadata variables to configure tag behavior and are always declared within the opening tag wrapper.

$$\text{Tag with Attribute} = \langle\text{tag\_name} \quad \mathbf{\text{attribute\_name}}=\text{"value"}\rangle$$

\subsection{4. Step-by-Step Practical Implementation}

\begin{lstlisting}
<a href="https://www.google.com">Click here to visit Google</a>
<img src="my-photo.jpg" alt="My Personal Portrait">
\end{lstlisting}

\textbf{Comprehensive Component Breakdown:}
\begin{description}
    \item[\lstinline|<a>| and \lstinline|</a>|:] Anchor element. Responsible for generating hypermedia links.
    \item[\lstinline|href=""|:] Hypertext Reference attribute. Specifies the destination target URL that the browser will fetch upon a user click event.
    \item[\lstinline|<img>|:] Image element. \textbf{Critical Architectural Rule:} This is a \textit{self-closing (void) tag}. It has no closing \lstinline|</img>| block because it encloses no text content; its entire structural state is configured purely via attributes.
    \item[\lstinline|src=""|:] Source attribute. Denotes the precise asset URL or file path location of the image file to be loaded.
    \item[\lstinline|alt=""|:] Alternative Text attribute. A crucial accessibility fallback. If network connections drop or asset rendering fails, the browser displays this text to explain what the visual media contains.
\end{description}

\begin{challengebox}{🎯 Hands-On Challenge (Task 2)}
Modify your existing \lstinline|index.html| document. Inject a hyperlink pointing to YouTube, and directly underneath it, configure an image element using an image file from your computer. Ensure both the image asset and your HTML file live inside the exact same file directory to simplify path resolution.
\end{challengebox}


% ====================================================
%                     LESSON 3
% ====================================================
\newpage
\section{⚡ Lesson 3: Professional Level (Forms \& Semantic Architecture)}

\subsection{1. Core Concept}
Enterprise production websites are not passive media feeds—they are dynamic, read-write applications. When inputting details on a platform like Facebook, you interact with a data collection framework known as a \textbf{Form}. At this professional stage, we look at how to capture and pass user-supplied datasets securely, while formatting layout nodes to conform to international \textbf{SEO (Search Engine Optimization)} standards.

\subsection{2. Physical \& Spatial Analogy}
A \lstinline|<form>| element structurally represents a physical, multi-input paper application form containing precise text fields and checkable option boxes. The user fills out these empty fields, and upon clicking the submission trigger, the browser aggregates the entries into an organized, unified packet data envelope. This payload is transmitted over the network straight to the server cluster for secure processing.

\subsection{3. Mathematical Breakdown}
Data submissions rely heavily on key-value structural mappings. Every input control element must carry a distinct, hardcoded programmatic identifier (\lstinline|name|) attribute. This allows the processing backend to evaluate the user entries as isolated mathematical variables linked to specific string values:

$$\text{Data Package} = \{ \text{username}: \text{"Ahmed"}, \text{age}: \text{"25"} \}$$

\subsection{4. Step-by-Step Practical Implementation}

\begin{lstlisting}
<main>
  <section>
    <h2>Create a New Account</h2>
    
    <form action="/save-data" method="POST">
      <label for="user">Username:</label>
      <input type="text" id="user" name="username">
      
      <br>
      
      <button type="submit">Register</button>
    </form>
  </section>
</main>
\end{lstlisting}

\textbf{Comprehensive Component Breakdown:}
\begin{description}
    \item[\lstinline|<main>| and \lstinline|</main>|:] A structural semantic element. It alters no visual styles but clearly tags the core, unique content area of the document for indexing web spiders.
    \item[\lstinline|<section>| and \lstinline|</section>|:] Breaks content down into individual context clusters (e.g., chapters, component widgets, or info blocks).
    \item[\lstinline|<form>| and \lstinline|</form>|:] The central parent box that groups interactive elements and configures data marshaling parameters.
    \item[\lstinline|action=""|:] An attribute containing the server endpoint destination URL where the finalized data payload will be handled.
    \item[\lstinline|<label>|:] A text descriptor mapped directly to an input component, ensuring accessibility for assistive devices.
    \item[\lstinline|<input>|:] An input field box. Setting \lstinline|type="text"| instructs the browser engine to expect standard plaintext alphanumeric inputs (this is also a self-closing structural element).
    \item[\lstinline|<button type="submit">|:] The programmatic execution trigger. When pressed, it runs validation checks, builds the structured data payload, and fires it over the network.
\end{description}

\begin{challengebox}{🎯 Hands-On Challenge (Task 3)}
Build a fully operational "User Login" interface containing two fields: one for user identification, and a second for credentials. Research and swap out the standard text type for \lstinline|type="password"| within your credential input element. Observe how the browser engine dynamically filters input text into masked security nodes to enforce user privacy. Notice how much control you now have over how data is processed on a web page!
\end{challengebox}

\end{document}
