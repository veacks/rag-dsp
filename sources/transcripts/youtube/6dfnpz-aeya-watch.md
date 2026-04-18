# YouTube Transcript

- URL: https://www.youtube.com/watch?v=6dFnpz_AEyA&list=PL9567DFCA3A66F299
- Video ID: 6dFnpz_AEyA
- Segments: 161

## Transcript (Welcome to this course on Digital Signal Processing
being taught by me. My name )

[62320.00s] Welcome to this course on Digital Signal Processing being taught by me. My name is S.C. Dutta
[73380.00s] Roy and I am an emeritus professor here. This is the first lecture in which we are going
[84710.00s] to introduce Digital Signal Processing in general and the course in particular.
[94220.00s] Is the course content readable on the screen? It is okay. I shall read it out. The course
[110740.00s] contents are given in the sheet that I have circulated. This is the span of the course.
[119400.00s] Let me tell you I do not expect any prior knowledge of DSP from you. All I assume is
[130810.00s] that you are acquainted with signals and systems.
[136420.00s] However, at least one third of the course shall be devoted to a review of signals and
[143850.00s] systems because it is extremely important that you understand discrete time signals
[151079.00s] and discrete time systems and what happens when discrete time signals interact with discrete
[162040.00s] time systems. The first two topics are: review of signals and systems and discrete time signals
[172390.00s] and systems in the time domain. We shall discuss typical signals. We shall go into the sampling
[179459.00s] process and then we shall characterize discrete time systems. We shall then introduce the
[189960.00s] special class of linear time invariant systems which I abbreviate as LTI and discuss classification
[198040.00s] of LTI discrete time systems. This will be followed by discrete time signals description
[205609.00s] or characterization in the frequency domain through various kinds of transforms and we
[213481.00s] shall introduce the discrete time Fourier transform and Discrete Fourier Transform,
[219919.00s] abbreviated as DFT.
[221850.00s] We shall talk about the computation of DFT; in other words, we shall go into the basics
[226880.00s] of FFT. We shall talk about linear convolution using DFT and also circular convolution using
[239090.00s] DFT. Then we shall introduce some new techniques which are not available in the book. We shall
[246850.00s] introduce Z-transforms in detail and their application in characterizing linear time
[252010.00s] invariant discrete time systems i.e. system description in the frequency domain. In other
[256510.00s] words, we shall talk about transfer functions and frequency response. Then we shall introduce
[262470.00s] simple digital filters, all-pass functions, complementary transfer functions and then
[269120.00s] digital two-pairs.
[272440.00s] We shall go back to sampling and reconstruction and have a small discussion on that. Then
[279280.00s] will go into digital filter structures that are direct, parallel, cascade, ladder and
[286350.00s] lattice for Infinite Impulse Response (IIR) filters and possible realizations for FIR
[295720.00s] or Finite Impulse Response filters, including poly phase. All-pass structures and tunable
[304820.00s] filters will follow this. We shall spend a considerable amount of time on digital filter
[311290.00s] design: infinite impulse response using impulse invariant and bilinear transformations, and
[320620.00s] finite impulse response filters using windowing and frequency response sampling techniques.
[327690.00s] A short discussion on computer aided design will also be included.
[331700.00s] We shall discuss spectral transformations for IIR design. If time permits, we shall
[332700.00s] also have a brief discussion on implementation considerations. This is what we aim to cover(?).
[342450.00s] At IITs, we do not cover a course; we uncover at least certain parts of the course. This
[354811.00s] is the aim and it does not matter how much we can do, but what we do must get imprinted
[363190.00s] in your mind.
[366660.00s] The books to consult: I have adapted S. K. Mitra, Digital Signal Processing - a computational
[373600.00s] approach, McGraw Hill 2000. This is the second edition; I would advice you to buy the third
[385460.00s] edition, which is available. A 4th edition is also due to be published. There are major
[396780.00s] changes which were effected by Professor Mitra in the later editions at the suggestions of
[403580.00s] a few people, including me.
[406660.00s] Those who have difficulty with signals and systems are advised to buy a copy of
[426020.00s] Oppenheim and Schafer, "Discrete Time Signal Processing." This is a Prentice Hall publication,
[442360.00s] 2000. This is about what we wish to do in the course.
[451590.00s] Since the topic is digital signal processing we shall explain the meaning of the individual
[463530.00s] terms and then what the combination means. First we concentrate on what is a signal.
[474050.00s] These are formal definitions and you must understand them very clearly.
[482110.00s] A signal in mathematical terms is a function. A function is a dependent variable of some
[499180.00s] variables which are independent variables. The number of independent variables can be
[513310.00s] one or more.
[515839.00s] In general, a signal is a function of several variables. These variables are x1, x2, x3
[524910.00s] and so on. These variables, for example could be time, distance, temperature or any other
[537300.00s] physical parameter. In this course we shall mostly be concerned with a function of a single
[546610.00s] variable and that variable will be time. But because we are talking of digital signal processing,
[558990.00s] time shall also lose its significance.
[563019.00s] Our functions will be functions of numbers and numbers are also restricted to be integers.
[573079.00s] In other words, in DSP the type of signal that we shall be concerned with are functions
[581480.00s] of a variable n, where n can take only integer values that are positive or negative. n can
[593400.00s] be -- 15 or it can be 0 or + 13 or + 14, but n = 13.5 is not permitted because time is
[603960.00s] discretized.
[607940.00s] If we plot this function or signal versus the variables, the resulting plot is called
[617370.00s] a waveform. If the function has only one variable, then a two dimensional picture in a graph
[629740.00s] paper suffices. The ordinary sinusoidal waveform that you draw on paper is a one dimensional
[640290.00s] signal and this is called a waveform. In general the waveform can be multidimensional, depending
[649270.00s] on the number of independent variables.
[653480.00s] For example, a picture, which is said to be worth more than 1000 words, has two dimensions.
[665120.00s] A picture should ideally be three dimensional, because it has three space variables. Dependent
[681070.00s] variable in an image can be brightness, color, density or it can be any other thing.
[692150.00s] So signals can be one dimensional, two dimensional or multi-dimensional. However, we shall be
[699700.00s] concerned only with one dimensional signal that is f (n). Signals can be natural, for
[709761.00s] example a thunderstorm or a lightning which are natural phenomena or it can be synthetic.
[717520.00s] Signals can be generated in the laboratory for communication purposes. Signals can be
[725860.00s] either analog or discrete. It is the discrete type signals that we are concerned with in
[734360.00s] this course.
[736330.00s] One common confusion is that all continuous signals are also called analog signals. All
[748730.00s] continuous time signals are analog signals but all analog signals are not continuous
[757530.00s] time. If the time is discretized but not the amplitude, i.e. If the independent variable
[769770.00s] is discretized but not the dependent variable, then it is still an analog signal.
[778610.00s] Therefore an analog signal can be either continuous time or discrete
[794930.00s] time. Discrete time signals are also analog signals. If a discrete time signal is quantized,
[811520.00s] that is, if in a discrete time signal where the independent variable has been discretized,
[820020.00s] the amplitude is also discretized, i.e. which is allowed to take on only certain specific
[829080.00s] values, then it is said to be discretized or quantized. So if a discrete time signal
[840100.00s] passes through A (analog) to D (digital) converter then depending on the number q of bits, 2
[847390.00s] to the power q discrete amplitudes are possible; for example, a three bit A to D converter
[853880.00s] gives 8 possible amplitudes.
[858430.00s] After A to D conversion, the signal is also coded in some form and the most usual form
[875060.00s] is the binary form. After discretization, the signal becomes a binary number and that
[884000.00s] is what we call a digital signal. I repeat here that analog
[900709.00s] and continuous time signals are not one and the same.
[905230.00s] As I have said earlier all continuous time signals are analog signals, but all analog
[914899.00s] signals are not continuous time. Analog signals can be continuous time and also discrete time.
[923620.00s] If the discretization is limited to the independent variable or the x axis only, the signal still
[931980.00s] remains analog. The digital signal can be obtained only when both the independent and
[939990.00s] dependent variables are discretized. A discrete time signal is analog and a digital signal
[948490.00s] is one in which the amplitude is also discretized. Why should we study signals at all? We study
[961040.00s] about signals because they carry information. It is information that drives the whole world,
[970839.00s] the basic steps being generation, transmission, reception, absorption, and action on the basis
[979300.00s] of information.
[981240.00s] Information is the basic thread of life and therefore we are interested in signals. Why
[990050.00s] processing? What is the need for processing? Processing is done to obtain the given signal
[997649.00s] in a more desirable form. For example, if there are a number of signals which are to
[1005339.00s] be transmitted over the same channel, then we do a processing called multiplexing. At
[1013541.00s] the receiver end the signals have to be separated and therefore there is a need for de-multiplexing.
[1020200.00s] Invariably the signal is corrupted by noise. Therefore our processing may aim at filtering
[1032010.00s] the noise out. I shall illustrate this with the help of a specific case, viz. the electrocardiogram
[1042039.00s] (ECG) waveform.
[1044760.00s] Electrocardiogram waveform usually looks like this. If you take one cycle and blow it up,
[1062789.00s] it will look like this. Doctors are interested where the peaks and dips occur. The standard
[1073330.00s] language used by doctors for them are PQRST. This is a very clean trace that you see here.
[1083179.00s] If this signal is corrupted, the PQRST points may be blurred and difficult to detect.
[1088840.00s] For example, the ECG waveform is usually corrupted with 50 Hertz Power Line Pick Up. The ever
[1100080.00s] present power, 230 volts 50 Hertz can be induced from any nearby equipment. It can be a magnetic
[1113909.00s] pick up or it can be an electrostatic pick up. It can be due to mutual capacitance or
[1122869.00s] mutual inductance. This is ever present and you may like to get rid of the 50 Hertz before
[1130610.00s] you look at the signal. This is done by a notch filter or a band elimination filter
[1139359.00s] which we shall study in this course.
[1142110.00s] There are also Electromyographic (EMG) signals due to the muscles. The human body is a wonderful
[1151039.00s] electrical machine. If you put two electrodes at any two places of body, it will record
[1157539.00s] an electric potential. The muscles themselves generate electrical signals and they might
[1164159.00s] corrupt the ECG signal. Hence there is a need for processing to get a clean picture.
[1173210.00s] Signal processing basically can be done in three ways: one is analog, that is, do not
[1185210.00s] convert the signal into digital and process it in the analog format itself. The other
[1191879.00s] two are digital processing and mixed signal processing, which is partly analog and partly
[1197639.00s] digital. One might ask here: what is wrong with totally analog processing?
[1205799.00s] Well, the answer to that is given by the proverb two arrows in a quiver is always better than
[1214840.00s] one, because if one fails, you can use the other arrow to hit the enemy. But then why
[1222610.00s] three? It is three because digital signal processing is so much more convenient and
[1231870.00s] so much more accurate than analog, while most of the natural signals that we generate in
[1240879.00s] the laboratory for communication are analog. Therefore you have to use mixed processing.
[1250990.00s] Analog signal processing dominated the field prior to 1970's but after 1970 because of
[1260490.00s] the easy availability of digital hardware in the form of integrated circuit chips at
[1268679.00s] a very low cost, digital signal processing got boosted up.
[1276159.00s] The current practice is mixed signal processing, dominated by digital signal processing. In
[1283211.00s] other words at any point in the signal processing chain if you find that DSP can be used, you
[1290990.00s] go ahead without thinking about any other choice. Analog signal processing advanced
[1302720.00s] in quantum jumps with the inventions of new devices and circuits.
[1307769.00s] We started with Acharya J.C. Bose's coherer and spark gaps. Spark gaps were used to generate
[1316549.00s] signals and coherer, a galena crystal was used to detect signals.
[1323710.00s] Coherer is a unipolar device and is a crude form of a diode as we know it now. That was
[1331450.00s] what we started with. Marconi's patent on telegraph signals also used a kind of spark
[1344730.00s] gaps with ON/OFF control. He also used an improved form of coherer to detect signals.
[1353700.00s] Then vacuum tubes came in the picture, triode in particular, which could amplify a weak
[1359779.00s] signal. Then in 1947 transistors came in the picture which made things smaller and made
[1370859.00s] life simpler because circuits were more designable with smaller power supplies. A 5 volt or 12
[1381129.00s] volt power supply does the job.
[1383570.00s] Further reduction in size was made possible due to the introduction of operational amplifiers
[1390330.00s] and other integrated circuits, analog as well as digital. Then there occurred this revolution
[1399600.00s] of small scale integrated circuits, medium scale integrated circuits, large scale integrated
[1408109.00s] circuits and finally VLSI, SSI etc. In fact, IC's are only limited by ones imagination
[1421960.00s] as to how much can you go. However, even today, advances in analog signal processing are going
[1430580.00s] in full swing because most signals of interest are analog. The real life signals like the
[1440700.00s] speech, music etc, are analog. The ultimate desired output in most cases is also analog.
[1466729.00s] Digital telephony has come in. You can process speech digitally and transmit digitally but
[1471879.00s] ultimately you cannot hear 1s and 0s; you have to convert into analog signal. Therefore
[1478460.00s] analog signal processing is also advancing and there is a lot of research that is going
[1484090.00s] on. Mixed signal processing is the trend of
[1505559.00s] the day.
