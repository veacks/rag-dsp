# YouTube Transcript

- URL: https://www.youtube.com/watch?v=SrJq2AzXZME
- Video ID: SrJq2AzXZME
- Segments: 2358

## Transcript (okay welcome welcome to digital signal)

[8780.00s] okay welcome welcome to digital signal
[12599.00s] processing if you're not here for
[14190.00s] digital signal processing this would be
[16410.00s] a good time to kind of sneak out of the
[18119.00s] room and not be too embarrassed if you
[20430.00s] are here I'm Alan Downey I teach at Olin
[24090.00s] College which is a new college just
[26730.00s] outside of Boston it's an engineering
[28500.00s] school and our job is to fix engineering
[31410.00s] education and one of the ways that I'm
[33630.00s] working on that is this book series
[35670.00s] which is called Fink X for all X that
[38540.00s] uses Python to teach other stuff so the
[42210.00s] premise is if you know how to program I
[44399.00s] can take a lot of material that's
[46260.00s] usually taught using mathematics and
[48270.00s] instead I can use a programming language
[50270.00s] which I think is more readable for a lot
[53399.00s] of people and it's also executable so
[55920.00s] you get to see how the thing works and
[58379.00s] run it and then work your way down and
[60660.00s] figure out how it works
[61920.00s] so the one I'm talking about today is
[64739.00s] think DSP I'm going to blast through
[68580.00s] about a semesters worth of digital
[71760.00s] signal processing in three hours which I
[74700.00s] hope will be really interesting and
[76530.00s] exciting I don't expect that everyone's
[79229.00s] going to completely understand this at a
[80970.00s] deep level the intent is that you're
[83430.00s] gonna get a picture of the what's the
[85979.00s] big idea and that you'll be interested
[88500.00s] enough that you can go learn more about
[90090.00s] it later either by reading my book or
[92880.00s] lots of other good resources signal
[96060.00s] processing I think is one of the coolest
[98520.00s] things that not enough people know about
[100829.00s] the ideas the ideas behind it are really
[104970.00s] profound and they change how you see the
[108000.00s] world and how you hear the world because
[110759.00s] a lot of what our senses do is signal
[113610.00s] processing in various ways so
[116149.00s] understanding this means understanding
[118170.00s] how you perceive the world there's also
[121259.00s] some really nice mathematics there and
[123689.00s] the fundamental algorithm the fast
[126119.00s] Fourier transform is just a really cool
[129030.00s] idea one of the most important ideas of
[131610.00s] sort of the 20th century
[134659.00s] problem is most people if you didn't do
[136950.00s] an engineering degree you probably
[139170.00s] didn't study this and even if you did
[141720.00s] you probably studied it mathematically
[143640.00s] and may not remember it particularly
[146370.00s] well one of the things that frustrates
[148590.00s] me a little bit this is kind of a
[150810.00s] standard curriculum in signal processing
[152450.00s] it's a good quality textbook but it
[156239.00s] takes a long time to get to the good
[158939.00s] stuff because if you're starting with
[161220.00s] mathematics the first chapter has to be
[164010.00s] complex arithmetic here's how you add
[166260.00s] complex numbers here's how you multiply
[168030.00s] complex numbers well we've got Python
[171510.00s] and Python has got complex arithmetic so
[174599.00s] we can skip over about seven chapters
[177359.00s] and get right to the good stuff and
[179129.00s] that's what we're gonna do so I think
[182459.00s] there's an opportunity here to make this
[184500.00s] stuff a lot more fun a lot easier to get
[187290.00s] into partly by using Python which I
[189900.00s] mentioned and partly by using sound
[192180.00s] which makes a lot of sense because what
[194579.00s] as I said what your ear does is a lot
[197489.00s] like the spectral analysis that we're
[199859.00s] gonna learn about the Fourier transform
[201810.00s] if you get a chance not now but some
[205139.00s] other time click that link and get to
[208500.00s] Vai hearts video that's called what's up
[210959.00s] with noise what is up with noise really
[213239.00s] nice explanation of this relationship
[215159.00s] between the signal that goes into your
[217709.00s] ear and how your brain then perceives
[220109.00s] that sound we'll get to a bit of it
[223349.00s] today the other nice thing about using
[226229.00s] Python is with an environment like a
[229829.00s] jupiter notebook you can explore this
[232079.00s] stuff interactively and that's the idea
[234840.00s] behind this workshop I can give you code
[237150.00s] you can see the code you can see the
[239250.00s] output you can try it out and then you
[241409.00s] can fiddle with it you can try some
[242849.00s] different examples we can do some
[244889.00s] exercises and hopefully it's a good way
[247470.00s] to learn about this stuff both effective
[249810.00s] and kind of fun as I mentioned this is
[252599.00s] all based on think DSP it's published by
[255030.00s] O'Reilly it's also available under a
[256979.00s] free license so you can grab it from
[258750.00s] green tea press you can download the PDF
[260549.00s] and see what you think of it
[263719.00s] alright so I'm gonna start
[267060.00s] right at the end and we're gonna work
[269220.00s] our way backwards this is an example
[271290.00s] from chapter 10 that shows off where
[274830.00s] we're headed and then we'll figure out
[277230.00s] how to get there
[278280.00s] if you saw the email I sent for the
[281400.00s] tutorial I advised you to bring
[283320.00s] headphones if you possibly can partly
[285780.00s] because almost every example that we're
[287460.00s] gonna do makes noise and if everybody's
[289169.00s] making noise at the same time it's gonna
[291030.00s] be chaotic but if you jump into Jupiter
[294930.00s] and let me close this up I was
[297870.00s] demonstrating this earlier but let me
[299550.00s] back up and run it again just in case
[302340.00s] people didn't see that so I've got a
[309810.00s] Jupiter server running I'm gonna shut
[311760.00s] that down jump back into my top-level
[319050.00s] directory so if you downloaded my
[321090.00s] repository you should have a directory
[322830.00s] called think DSP if you CD into that
[326610.00s] directory and then launch Jupiter it'll
[334050.00s] either launch a browser for you or it'll
[336240.00s] open up a tab if you already have a
[337560.00s] browser running and now you've got a
[340560.00s] Jupiter server running on your laptop
[342360.00s] and you also have a browser that's
[344160.00s] talking to that server so this is the
[346260.00s] browser view and you can navigate
[348150.00s] through your file system in order to
[350610.00s] find this directory and eventually get
[354210.00s] to the code directory and get to chapter
[360300.00s] 10 preview chapter 10 preview type I and
[365370.00s] B I PI NB is the suffix for a Jupiter
[368550.00s] notebook because it used to be the
[370080.00s] ipython notebook so the name change but
[373440.00s] the suffix hasn't cut up and if you run
[379620.00s] the first cell if it doesn't complain
[383160.00s] about anything that means you have all
[384780.00s] the packages installed that we're gonna
[386250.00s] need if it does you might have to
[389370.00s] install something and let me know if you
[391680.00s] know what you're doing go ahead and if
[393360.00s] you don't I'll come around in a minute
[395039.00s] and help you out if everything's working
[398060.00s] then work your way through this
[400640.00s] example and we'll talk about it in a
[402870.00s] couple of minutes
[675460.00s] okay how many people have had a chance
[677980.00s] to work through the notebook and been
[679510.00s] able to run that last example anybody
[683050.00s] not yet able to run that last example
[685020.00s] okay still working on some issues that's
[688480.00s] fine we'll get there the fundamental
[691000.00s] thing that this is showing is that I can
[693580.00s] take a signal that's reported in one
[696430.00s] room so this is an example from
[699339.00s] freesound.org which is where I got a
[702310.00s] bunch of wav files under free licenses
[705130.00s] which made them very nice to work with
[706480.00s] so this is what the original recording
[708640.00s] sounds like well we used to have audio
[712990.00s] working let me pause for a minute while
[719680.00s] we get audio going
[769600.00s] this was working during setup but not
[772330.00s] now all right we'll continue to work on
[777640.00s] that
[787180.00s] let me talk a little bit about the next
[789130.00s] couple of sections here and then when we
[790630.00s] get to the next notebook we'll keep
[792190.00s] working on that see if we can get it
[793630.00s] working so that example when you hear it
[797920.00s] sounds like okay I took a recording from
[800170.00s] from one room and I simulated what it
[803110.00s] would sound like in a different room
[805080.00s] when you hear it you get a sense of okay
[808480.00s] that's probably a big room it sounds
[810160.00s] like a big echoey room and our ear has
[813610.00s] kind of a good sense of acoustics like
[815620.00s] that we can tell what a room is like how
[818290.00s] we did that using signal processing at
[820780.00s] this point should not make sense yet it
[822970.00s] is pretty much black magic by the time
[825520.00s] we're done today hopefully it's not
[827170.00s] black magic the things you need to
[829120.00s] understand are the Fourier transform
[831810.00s] convolution theorem and LTI Theory
[835510.00s] linear time-invariant theory and those
[838150.00s] are the three things we're going to work
[839530.00s] on today again maybe not in a super deep
[842890.00s] way but hopefully you'll leave
[844680.00s] understanding how these three pieces
[846700.00s] explain that example that you just saw
[849670.00s] and heard next thing I want to introduce
[854770.00s] is the module that is in think DSP and
[859690.00s] that we'll use for the for the workshop
[862360.00s] there are three classes that you need to
[864430.00s] understand here one of them is a signal
[866800.00s] class that represents anything that
[869620.00s] varies in time now when we're thinking
[871630.00s] about sound it's the amplitude of a
[873700.00s] pressure wave in air that's what sound
[877570.00s] is that's varying over time and
[879970.00s] represented in this case by a continuous
[881950.00s] mathematical function a wave is what you
[886390.00s] get if you take a continuous signal and
[888370.00s] you sample it at a discrete sequence
[889930.00s] usually equally spaced points then you
[893290.00s] get a wave and we're going to go back
[895300.00s] and forth between a wave and its
[897100.00s] spectrum the spectrum is the Fourier
[899560.00s] transform of the wave if you don't know
[902620.00s] what that is you will in just a second
[904540.00s] here's the relationship these are all
[906580.00s] the classes we're going to use today so
[908950.00s] given a signal which is continuous I can
[911920.00s] sample it and get a wave so the wave is
[914710.00s] a discrete sequence of samples given a
[917380.00s] wave I can compute its spectrum and give
[919990.00s] it a spectrum ACK
[920860.00s] go back and compute the corresponding
[922510.00s] wave we'll also in a couple of minutes
[926110.00s] get to the other piece up there which is
[927850.00s] the spectrogram but this is it these are
[930130.00s] the only classes we're going to use
[931450.00s] today so if you jump back into the
[934780.00s] notebook chapter one I P I PI NB
[938620.00s] introduces those classes read through
[941440.00s] the text run the code and start in on
[943780.00s] exercise one and I will both come around
[946810.00s] and help you out with stuff and also
[949150.00s] work on being able to play some of the
[950530.00s] examples
[1308920.00s] hugging it back in turned out to be what
[1311559.00s] we needed
[1331570.00s] if you're working on the exercise and
[1334160.00s] you're making good progress you can
[1335570.00s] ignore me if you're stuck I'll put a
[1338150.00s] solution up here and you can follow
[1339590.00s] along and then I'll go over it in just a
[1341600.00s] minute
[1378980.00s] so the idea here is that I've created
[1381500.00s] two signals a cosine and a sine that
[1385520.00s] have different frequencies and different
[1387050.00s] amplitudes and I've added them together
[1389180.00s] and when you plot that wave you can kind
[1392240.00s] of see okay there's a high frequency
[1393770.00s] thing there which is the the extra
[1395960.00s] Wiggles and the low frequency there
[1398360.00s] which is the outline of that wave if you
[1402470.00s] plot the whole wave you can't really see
[1404150.00s] very much because it's way too many
[1405500.00s] periods of the wave to compute the
[1409310.00s] spectrum well I've got a method that's
[1411110.00s] called make spectrum I'm gonna unwrap
[1412820.00s] that in a minute and I'll show you how
[1414770.00s] it does what it does but for now it's
[1417140.00s] magic it just takes away it computes the
[1419660.00s] corresponding spectrum and what you see
[1421910.00s] is that it shows you oh that's that wave
[1424520.00s] contains two frequency components I've
[1427250.00s] got one spike that's at 440 Hertz
[1429560.00s] another spike that's at 880 Hertz and
[1432470.00s] the heights of those lines are the
[1434810.00s] amplitudes of those two frequency
[1437390.00s] components so if you want to play around
[1440030.00s] with this a little bit you can try to
[1441620.00s] trick the Fourier transform by adding in
[1448730.00s] more frequency components so if you make
[1450740.00s] a copy of that and make another signal
[1453710.00s] and let's make it at I don't know 1,500
[1456290.00s] Hertz and I'll give it an amplitude of
[1459310.00s] 0.75 make this up anything that you want
[1463340.00s] and I'm gonna call it signal 3 and I'm
[1469610.00s] gonna add up all three signals so when I
[1474470.00s] look at this wave as a function of time
[1477140.00s] I expect to see some high frequency
[1479870.00s] Wiggles because 1,500 Hertz is now a
[1482810.00s] higher frequency than what I had before
[1484670.00s] and sure enough I'm seeing some finer
[1487430.00s] looking squiggles than what I had before
[1489680.00s] and now if I plot the spectrum I expect
[1494150.00s] to see not two but three spikes because
[1497780.00s] I now have a signal with three frequency
[1500570.00s] components in it and that's it that's
[1503660.00s] the fundamental idea of what a spectrum
[1506570.00s] is which is if you've got a signal that
[1509600.00s] is the sum of a bunch of frequency
[1512060.00s] components
[1512840.00s] the spectrum will show you for each
[1515659.00s] component what the amplitude of that
[1518269.00s] component is so if you add things up in
[1521269.00s] the time domain you can see one spike
[1524059.00s] per frequency component in the frequency
[1527179.00s] domain and that's the fundamental idea
[1530600.00s] that's what spectral analysis is what it
[1532879.00s] says is that any signal can be
[1535100.00s] represented as the sum of components
[1537259.00s] where each component just has one
[1538759.00s] frequency in it and what the spectrum is
[1542029.00s] is the list of components and the
[1544789.00s] amplitude of each of those components
[1548950.00s] the other part of what we kind of saw I
[1551690.00s] was hidden from you is the discrete
[1553279.00s] Fourier transform and that is how you
[1555559.00s] get from a wave to its spectrum that's
[1559940.00s] what the discrete Fourier transform is
[1562009.00s] the fast Fourier transform the FFT that
[1564830.00s] you've probably heard of is a fast
[1567409.00s] algorithm for computing the DFT so these
[1570440.00s] are two related things the DFT is the
[1572330.00s] transform itself the FFT is an algorithm
[1575899.00s] for computing that transform but they're
[1578570.00s] so closely related that people use the
[1580669.00s] two terms interchangeably so I'll
[1582409.00s] forgive you if you do that next thing I
[1586220.00s] want to do is explain how that works
[1587779.00s] because we've been using this thing DSP
[1589759.00s] library which is a wrapper for basically
[1593840.00s] numpy and scifi so numpy has a module
[1597200.00s] that's called FFT
[1598190.00s] that provides a bunch of functions one
[1600799.00s] of them is our FFT which stands for real
[1603559.00s] FFT as contrasted with the complex
[1606409.00s] Fourier transform in this case what we
[1610220.00s] are computing the spectrum of is a
[1613429.00s] signal that we measured it's a thing
[1615080.00s] that we measured in the real world
[1616929.00s] things that you measure in the real
[1618919.00s] world have real quantities it's really
[1621559.00s] hard to measure anything in the real
[1622850.00s] world and get a complex number so
[1625730.00s] because we're working with sound it's
[1628009.00s] always real valued and so we're gonna
[1629600.00s] use the our FFT and here's what it looks
[1634730.00s] like if you open up the think DSP pi
[1637669.00s] you'll find a class that's called waves
[1640159.00s] that defines a function or a method
[1642259.00s] called make spectrum and what makes
[1645080.00s] spectrum does is it call
[1646430.00s] our FFT to compute the Fourier transform
[1650150.00s] that's how we at the amplicon C
[1654260.00s] component and then it calls our FFT
[1657320.00s] frequency which computes the x-axis it
[1661700.00s] tells us what the range of frequencies
[1663980.00s] is that those amplitudes correspond to
[1666470.00s] and what this object does is then take
[1669140.00s] those two pieces of information the
[1671900.00s] frequencies which are the F's and the
[1674270.00s] amplitudes which which are the h's and
[1676460.00s] just puts them together into an object
[1678290.00s] which makes sense from the point of view
[1680990.00s] of data encapsulation those two arrays
[1684320.00s] they're both numpy arrays are they
[1687860.00s] contain the two pieces of information we
[1690140.00s] want for a spectrum so I'm just gonna
[1692390.00s] put them to get a spectrum object the
[1696950.00s] DFT itself the way it works I like to
[1700880.00s] think of it as a whole bunch of
[1702710.00s] correlations so if you know that your
[1706460.00s] signal is made up of lots of different
[1708110.00s] frequency components you can find the
[1711170.00s] amplitude for each one by just
[1713710.00s] constructing a sine wave at each
[1716510.00s] frequency so this is for different
[1718400.00s] frequencies the highest frequency is the
[1722690.00s] most squiggly line and then they get
[1724550.00s] smoother and smoother the top one there
[1726950.00s] is zero frequency zero frequency means
[1730460.00s] it doesn't vary in time so it's a
[1732200.00s] constant and now what I can compute is
[1735650.00s] the correlation of my signal with each
[1739370.00s] of those sinusoids and if my signal
[1742940.00s] contains a strong component at a given
[1745820.00s] frequency then that correlation will be
[1748010.00s] high and if I don't have any energy at
[1750710.00s] that frequency then the correlation will
[1752390.00s] be low and that's what you see in the
[1754190.00s] right hand column there is a spike at
[1757220.00s] each frequency where the height of that
[1759800.00s] spike is proportional to the amplitude
[1762050.00s] or energy it can be either one the
[1765470.00s] energy that's in that frequency
[1767150.00s] component slowly pause there for a
[1771170.00s] second that's kind of a blast through
[1773090.00s] discrete Fourier transform questions
[1775880.00s] thoughts how much sense is this making
[1780050.00s] okay so far all right the next thing
[1785600.00s] that's in the notebook is this idea of
[1787370.00s] filtering and this is the idea of taking
[1790130.00s] the signal and taking each of its
[1793429.00s] frequency components and either
[1795559.00s] amplifying or attenuating different
[1798800.00s] components by different amounts the
[1802220.00s] example that's in the notebook is a
[1803570.00s] low-pass filter what low-pass means is
[1806179.00s] that I'm going to take the low frequency
[1808640.00s] components I'm going to allow them to
[1810320.00s] pass relatively unchanged I'm going to
[1813620.00s] take my high frequency components I'm
[1815210.00s] going to attenuate them meaning turn
[1817010.00s] down the volume and if you had a chance
[1819860.00s] to run the example you heard what a low
[1822260.00s] pass filter sounds like it takes all the
[1825110.00s] high frequency components from a signal
[1827120.00s] and mutes them and what it sounds like
[1830120.00s] is the stone that you hear when ever
[1831950.00s] sound has gone through soft fluffy
[1835130.00s] things because everything that soft and
[1837950.00s] fluffy is basically a low-pass filter so
[1840770.00s] if you hear sound through water or
[1842840.00s] through a pillow or through a wall it
[1846370.00s] sounds like it's gone through a low-pass
[1848300.00s] filter
[1848960.00s] it also kind of sounds like old
[1852130.00s] telephone service which is also a
[1856520.00s] low-pass filter on standard telephone
[1860809.00s] lines just about everything above 3000
[1863809.00s] Hertz doesn't get through so if you ever
[1866929.00s] heard a voice live and then heard the
[1868910.00s] same voice over a phone that's what that
[1871280.00s] difference is the high frequency
[1872420.00s] components are gone
[1874630.00s] this was I have a couple of slides in
[1876980.00s] the notes to talk about custom libraries
[1879230.00s] and a couple of thoughts I'm gonna skip
[1880610.00s] over that because it's not important for
[1882440.00s] where we are right now but I do want to
[1884960.00s] show one example from the notebook which
[1890570.00s] is this interaction so hopefully if
[1893710.00s] Jupiter is behaving for you you should
[1896990.00s] be able to adjust those sliders and hear
[1899450.00s] different sounds depending on the
[1901100.00s] settings so this is the original signal
[1905240.00s] with a cut-off a high a low-pass filter
[1909080.00s] that cuts off at 5,000 Hertz so
[1912320.00s] everything from 5,000 on
[1913910.00s] has been removed and let's see if we're
[1915410.00s] able to play to me that kind of sounds
[1924890.00s] like it's gone through an old phonograph
[1927740.00s] or an old sound system that's not very
[1930230.00s] good if you turn the cut-off down to
[1933020.00s] 3000 what you're simulating is a
[1938300.00s] telephone line so here's what that
[1940940.00s] recording would sound like if you played
[1942350.00s] it over a telephone and you can hear
[1948800.00s] that it's sounding more muffled more
[1950360.00s] muted than it did before and here's what
[1953450.00s] it would sound like if you played it
[1954470.00s] through a pillow so it's getting to the
[1962390.00s] point where you can only hear the bass
[1964070.00s] part and all of the high-frequency
[1965780.00s] components are gone and maybe if you
[1968060.00s] hear it through a wall it might cut off
[1972050.00s] at 700 or so or maybe that sounds like
[1980810.00s] water does to me and what's the lowest
[1983570.00s] this'll go down to what happens if we
[1985370.00s] cut it off at 100 not much left so I
[1991490.00s] think all that was left there was a
[1992900.00s] little bit of noise at some 100 Hertz or
[1995660.00s] so good alright so the intent of that
[1998690.00s] example is at this point you've got some
[2000670.00s] idea of what it means to take a signal
[2002470.00s] and apply a filter to it in this case
[2004510.00s] it's a low-pass filter and you've got
[2006580.00s] some intuition for what effect that has
[2008680.00s] on the signal if you look at the
[2011050.00s] waveform it gets smoother and smoother
[2013030.00s] if you look at the spectrum all the
[2015010.00s] high-frequency components are gone and
[2017020.00s] if you hear what it sounds like it
[2018790.00s] sounds like it's increasingly muffled
[2020620.00s] like it's underwater that's it for the
[2024850.00s] chapter one notebook if you want to dive
[2027190.00s] into chapter two start that up read the
[2030460.00s] text run the code and just do the first
[2033280.00s] section the section that's called
[2034780.00s] waveforms and harmonics again I'll come
[2037720.00s] around and help you out and answer
[2038920.00s] questions and we'll get started again in
[2040810.00s] a few minutes
[2310030.00s] all right if you're working on the
[2312290.00s] chapter 2 notebook the first section is
[2317390.00s] about different waveforms and what their
[2321140.00s] spectrums look like and there's kind of
[2324050.00s] a pattern here that I wanted to show you
[2325940.00s] and then pose a little bit of a puzzle
[2328280.00s] so two things you notice if you look at
[2331310.00s] the square that's the top left and the
[2334310.00s] sawtooth is the top right and the
[2336830.00s] triangle wave there's two patterns that
[2340970.00s] you see in how quickly the harmonics
[2343940.00s] drop off so the square wave has a lot of
[2348410.00s] high frequency components so even when
[2352040.00s] you get up to many multiples of the
[2354740.00s] fundamental frequency there's still a
[2356570.00s] lot of energy there and you can see that
[2359660.00s] partly in the wave that it has lots of
[2361790.00s] sharp corners and sharp corners in a
[2364550.00s] wave correspond to high frequency
[2366890.00s] components in the spectrum the triangle
[2370070.00s] well it still has a pointy bit but it's
[2372500.00s] a smoother function it doesn't have any
[2374330.00s] discontinuities and even when it makes
[2377390.00s] that corner it's a sharp corner but it's
[2379520.00s] not from a mathematical point of view
[2381470.00s] not as sharp and as a result it doesn't
[2384800.00s] have as many high frequency components
[2388720.00s] well both so it's discontinuities what
[2391670.00s] I'm calling a jump or discontinuity in
[2395000.00s] the sine wave that's a really high
[2397580.00s] frequency component the other one when
[2400220.00s] it comes to a sharp corner that's a
[2401960.00s] discontinuity in the derivative which is
[2404420.00s] also a discontinuity but it's not as
[2406910.00s] high frequency the other pattern that
[2410750.00s] you see is that some of these waveforms
[2412460.00s] only contain odd multiples of the
[2416210.00s] fundamental tone and some of them
[2418160.00s] contain all of the integer multiples so
[2421100.00s] the left there says odd harmonics only
[2423590.00s] and the right says it has both even and
[2425869.00s] odd harmonics so in some sense we've now
[2429109.00s] discovered three out of the four
[2431810.00s] quadrants in this graph and the natural
[2434540.00s] thing that you might wonder is is there
[2437060.00s] a wave form kind of a simple wave form
[2439460.00s] like these other ones that has
[2442140.00s] fast drop-off meaning not super high
[2444869.00s] frequency components but it contains all
[2447660.00s] the harmonics not just the odds but also
[2450089.00s] the evens so I wanted to pose that
[2453240.00s] puzzle I'm not going to answer it yet
[2455789.00s] but if you want to know the answer if
[2457890.00s] you look at the chapter 2 solution
[2459839.00s] notebook you can look there so do that
[2463109.00s] if you want to if you've got a little
[2464490.00s] bit of extra time the other thing I'd
[2466529.00s] like you to do is get back into the
[2468089.00s] notebook and read the next section which
[2470250.00s] is called aliasing
[2638110.00s] okay let me interrupt you for a second
[2640360.00s] just to talk about this section a little
[2641710.00s] bit
[2642310.00s] so what aliasing is is kind of the error
[2646780.00s] that you get when you take something
[2649030.00s] that's actually continuous the signal is
[2651040.00s] a continuous function in mathworld
[2654820.00s] which means it's kind of an idealization
[2656710.00s] nothing in the real world is like that
[2659050.00s] when we look at a wave what we've done
[2661600.00s] is taken a discrete set of samples from
[2665050.00s] something that's continuous which means
[2666760.00s] that we've lost some information and in
[2669130.00s] particular we can't always tell what
[2671560.00s] frequency the thing was the example
[2674380.00s] that's in the notebook has two different
[2677880.00s] fundamental signals two sinusoidal them
[2681460.00s] is at 4500 Hertz the other one is that
[2684070.00s] 5500 Hertz and if we sample them at this
[2687220.00s] particular frequency the frame rate is
[2689550.00s] 10,000 samples per second when you
[2692860.00s] sample at 10,000 Hertz or 10 kilohertz
[2697300.00s] the highest frequency component that you
[2700690.00s] can accurately identify is half of that
[2704160.00s] so if you sample at 10,000 the highest
[2707560.00s] frequency you can identify is 5000
[2710230.00s] everything over 5000 gets aliased which
[2714460.00s] means that it seems as if it is at a
[2716800.00s] lower frequency and that's what this
[2719050.00s] graph is intended to show the gray line
[2722260.00s] there is the actual continuous signal
[2725650.00s] and in reality in the real world
[2729130.00s] the first one is 4,500 Hertz and the
[2731380.00s] second one is 5500 Hertz but if you
[2734260.00s] sample them at discrete points and these
[2736510.00s] these points are every tenth of a
[2739000.00s] millisecond you'll notice that the
[2741520.00s] samples in both cases are exactly the
[2744490.00s] same so if I take away the gray lines if
[2748480.00s] you don't see what the gray lines are
[2750100.00s] and you only see the samples there is at
[2753190.00s] that point no way to know which of those
[2755650.00s] two signals the samples came from the
[2758920.00s] 5500 and the 4500 appeared to be exactly
[2762070.00s] the same as far as we can tell by
[2764320.00s] looking at samples and that's what
[2768070.00s] aliasing is I mentioned a second ago
[2770560.00s] this folding free
[2771880.00s] Quincy or Nyquist frequency which is the
[2774730.00s] highest frequency that you can identify
[2776259.00s] based on samples and it's half of the
[2779710.00s] sampling rate and that's a nice
[2781930.00s] derivation of why that's the case that
[2783789.00s] I'm not going to show you I'm just going
[2785289.00s] to assert that that's true the reason
[2788529.00s] it's called the folding frequency is
[2790420.00s] that everything that's above and this is
[2793990.00s] five thousand as my example everything
[2795579.00s] that's about five thousand is going to
[2797710.00s] get folded back into the range from zero
[2800559.00s] to five thousand so fifty five hundred
[2803880.00s] gets folded over and becomes forty five
[2807009.00s] hundred or it appears to be forty five
[2808990.00s] hundred six thousand would get folded
[2812230.00s] over and it would appear to be four
[2813700.00s] thousand okay you can start to think
[2817269.00s] about what that pattern looks like so
[2818920.00s] seven thousand gets folded over seven
[2821319.00s] thousand is two thousand in excess of my
[2825519.00s] folding frequency so it's going to get
[2827559.00s] rapped over to two thousand below my
[2830289.00s] folding so seven thousand goes down to
[2833380.00s] three thousand eight folds to two nine
[2838569.00s] folds to one where do you think ten
[2841509.00s] folds to zero which ends up looking like
[2849039.00s] a flat line so I actually can't
[2851980.00s] distinguish between adding a 10,000
[2855730.00s] Hertz signal or adding an offset where
[2858549.00s] it just shifts the signal up or down a
[2860740.00s] little bit once I'm looking at discrete
[2862960.00s] samples I can't tell the difference now
[2866079.00s] let's see if ten thousand wraps down to
[2869170.00s] zero where do you think eleven thousand
[2871779.00s] goes eleven has to go down to negative
[2876819.00s] one or negative one thousand I'm doing
[2879009.00s] everything in kilohertz goes so eleven
[2881589.00s] kilohertz goes down to negative one
[2883779.00s] kilohertz negative one kilohertz folds
[2886809.00s] back again into the positive zone and
[2889059.00s] becomes positive one kilohertz and so on
[2892720.00s] it keeps on folding so it gets wrapped
[2896200.00s] back and forth it back and forth until
[2897880.00s] it lands in that range one of the ways
[2902470.00s] that you can see this happening is by
[2904480.00s] looking at a hard
[2905410.00s] monix series like the signals that we've
[2907450.00s] been looking at and you can see that all
[2909610.00s] the high-frequency components if they
[2911650.00s] exceed the folding threshold get wrapped
[2914230.00s] back in and seem as if they are lower
[2917620.00s] frequencies and if you go back to the
[2920920.00s] notebook all the way to the bottom
[2925980.00s] if I remember right there is an
[2928900.00s] interaction here that you can play
[2930310.00s] around with where you can take a signal
[2936120.00s] and let me remember what this is I think
[2938470.00s] it's a square wave it is a sawtooth take
[2941950.00s] a sawtooth at a given frequency in this
[2944800.00s] case it's a hundred and then sample it
[2947290.00s] at a different frame rate so let's see
[2952090.00s] what happens if I crank this up the
[2955150.00s] frequency up to a thousand okay that
[2962290.00s] kind of looks okay so if the actual
[2964840.00s] signal is a thousand then it's got
[2968260.00s] harmonics at 2,000 3,000 4,000 and 5,000
[2972730.00s] that's what we're seeing there it's
[2975970.00s] being sampled at 10 kilohertz
[2979060.00s] so the cutoff is 5 kilohertz and that's
[2981490.00s] what you're seeing there what happened
[2984130.00s] to the 6,000 6,000 appears like it's
[2989050.00s] 4,000 so it gets added in to the 4,000
[2992440.00s] component and so on so this doesn't look
[2995050.00s] too bad because all of my aliased
[2998170.00s] components overlap with the actual
[3001890.00s] harmonics that are in the signal and so
[3004710.00s] if you listen to it it doesn't sound
[3006720.00s] like we've messed it up too much it kind
[3012990.00s] of sounds like a sawtooth that a
[3014370.00s] thousand Hertz so that's alright but
[3017550.00s] what if it was eleven hundred Hertz now
[3023430.00s] all of those aliased harmonics are
[3027030.00s] falling in between the actual harmonics
[3030030.00s] so they're adding frequency components
[3033120.00s] that are not actually in the signal but
[3036120.00s] appear in the wave because of the
[3038820.00s] sampling
[3039330.00s] process and you're gonna hear this which
[3042060.00s] is that this is gonna sound like it's
[3043740.00s] much more messed up than the original
[3046330.00s] [Applause]
[3048770.00s] part of the reason that that's such an
[3050940.00s] unpleasant noise is that it contains a
[3053640.00s] bunch of frequency components that are
[3056130.00s] not harmonics they are not multiples of
[3059010.00s] the fundamental tone instead they are
[3062100.00s] just random aliased tones that in some
[3066030.00s] sense aren't supposed to be there so
[3067640.00s] take a couple minutes play around with
[3069840.00s] that interaction and see how these two
[3072570.00s] things interact see how the actual
[3075900.00s] signal interacts with the sampling rate
[3079820.00s] to produce aliasing and hear what that
[3083370.00s] sounds like
[3189510.00s] all right in the schedule for the
[3192069.00s] tutorials we're supposed to take one
[3193690.00s] longer break in the middle I'm gonna
[3195640.00s] suggest that we take two somewhat
[3197559.00s] shorter breaks just because I think it's
[3199930.00s] nice to do it's kind of a long time to
[3202150.00s] go so we're at about one hour in let's
[3205000.00s] take our first break here if you want to
[3206920.00s] keep playing with this notebook you can
[3208619.00s] stretch out get a get a drink relax your
[3212770.00s] brain will come back in 10 minutes which
[3215170.00s] is at 2:35
[3865420.00s] okay welcome back I have tea now so I'm
[3869180.00s] all happy and hopefully my voice will be
[3870950.00s] okay for the rest of the tutorial so
[3873319.00s] this is the function we looked at a
[3874880.00s] little bit before we started out using
[3876440.00s] these wave objects and the spectrum
[3878720.00s] objects we went down one level and I
[3881210.00s] said okay this is all based on the our
[3883670.00s] FFT the real FFT I want to go one more
[3886849.00s] level down because I've been lying to
[3889460.00s] you a little bit about these amplitudes
[3892069.00s] I've been showing you on the spectrum
[3894650.00s] that the height of that line corresponds
[3897289.00s] to how loud that frequency component is
[3900289.00s] what I didn't tell you is that it's
[3902329.00s] actually a complex number and it
[3904760.00s] actually represents two pieces of
[3906619.00s] information
[3907220.00s] so those H's the result that you get
[3910039.00s] back from our FFT is an array of complex
[3913640.00s] numbers and the F's the frequencies
[3917660.00s] those are just plain old real numbers
[3919520.00s] but the H's are complex numbers that
[3921859.00s] encode two pieces of information which
[3925250.00s] are the offset the magnitude how loud
[3927920.00s] the thing is and the offset which is
[3930020.00s] where in the cycle that sinusoid begins
[3933910.00s] so just to remind you I'm going to
[3936079.00s] assume that many of you have seen
[3937400.00s] complex numbers before the usual way you
[3940849.00s] think about complex numbers is that
[3943039.00s] there's a real component and an
[3945079.00s] imaginary component and if you plot them
[3947869.00s] on an XY plane where X is the real axis
[3951020.00s] and Y is the imaginary axis then you can
[3954829.00s] think of any complex number as being a
[3956599.00s] point on this plane in the context of
[3960079.00s] signal processing we almost never care
[3962900.00s] about the real part and the imaginary
[3964369.00s] part because those have no physical
[3966859.00s] interpretation but another way to think
[3969799.00s] about what a complex number is is it's
[3972380.00s] an angle and a magnitude and the
[3975230.00s] magnitude is the length of that blue
[3977450.00s] line if you think of it as a vector it's
[3979700.00s] the the magnitude of the vector that
[3982520.00s] length corresponds to the loudness of
[3985400.00s] the sound the angle is called the phase
[3988880.00s] offset and it tells you where in the
[3991430.00s] cycle that sound started which is this
[3993920.00s] picture here that value fee is telling
[3997549.00s] you how much this signal
[3998950.00s] is being shifted to the left or to the
[4001410.00s] right okay so the amplitude is loudness
[4005190.00s] and the phase is where in the cycle we
[4008490.00s] started but when we plot the spectrum we
[4012210.00s] only ever plot the amplitude we hardly
[4015690.00s] ever care about phase and part of that
[4019200.00s] is because of how we perceive sound
[4021660.00s] which is we really care about loudness
[4024359.00s] that's a big part of what our ears
[4026250.00s] detect we don't care as much about phase
[4030770.00s] but this is a question that I was
[4032910.00s] wondering about which is I wonder do we
[4034859.00s] detect phase at all or are we completely
[4038910.00s] oblivious to it and this is what the
[4041790.00s] next part of the notebook is meant to
[4043619.00s] explore a little bit so if you jump back
[4045690.00s] into chapter 2 we skipped over this so
[4048420.00s] you're gonna skip back to the section
[4050190.00s] called amplitude and phase and run
[4052680.00s] through that and think a little bit
[4054000.00s] about what you're seeing
[4313670.00s] okay let me show you a couple things in
[4316130.00s] this example so the idea I start out
[4318530.00s] with a sawtooth and at this point if we
[4322400.00s] compute the spectrum of a sawtooth we're
[4325490.00s] not too surprised again that's the
[4327590.00s] amplitude of each component and if I
[4330770.00s] plot the phase of each component I
[4334900.00s] basically get a big mess and the range
[4338600.00s] here these are in radians so you can
[4340580.00s] think of these as being angles on a
[4342470.00s] circle from 0 to 365 degrees or in
[4346700.00s] radians it's from 0 to 2pi or if you
[4350330.00s] prefer it's from negative PI to positive
[4352880.00s] PI so that's why the vertical axis there
[4355340.00s] is from roughly negative 3 to positive 3
[4357530.00s] because pi is about 3 in this plot we
[4362690.00s] don't really learn anything about the
[4364250.00s] phase there actually is some
[4366320.00s] mathematical structure there you could
[4368180.00s] take a saw to figure out what the
[4370970.00s] components are of phase there's some
[4373580.00s] structure that we're not seeing because
[4375140.00s] of numerical computation but you might
[4379280.00s] wonder ok so what does phase sound like
[4381320.00s] one way to figure that out is to take
[4384890.00s] the signal split it up into its
[4387590.00s] amplitudes and its phases we're going to
[4390380.00s] keep the amplitudes we're gonna leave
[4391910.00s] those unchanged and I'm just gonna take
[4394340.00s] all the phases and I'm gonna randomly
[4396140.00s] shuffle them so if anything that's going
[4398480.00s] to mess up a sound it would be to
[4400640.00s] shuffle if I if I shuffle the amplitudes
[4402800.00s] this sound would totally sound different
[4406040.00s] and Rach maybe I'll do that example in
[4408020.00s] just a second if I shuffle the phases
[4410680.00s] it's going to change the waveform quite
[4414980.00s] a lot so I shuffle the phases and then
[4422270.00s] this this code right here is taking the
[4428740.00s] amplitudes which I have not changed and
[4431060.00s] the phases which I have shuffled and
[4433220.00s] packing them back into a spectrum I can
[4436550.00s] then take that spectrum and do the
[4438950.00s] inverse Fourier transform to get the
[4442010.00s] corresponding wave that's what's going
[4444380.00s] on here and what I see is that my
[4446989.00s] Sawtooth which used to look like this
[4450070.00s] now looks like this it is a totally
[4456530.00s] different looking wave and yet when I
[4460249.00s] play these two waves they sound pretty
[4464630.00s] much the same to my ear almost the same
[4477980.00s] the modified one might be just a tiny
[4482300.00s] bit muffled might sound like it's been
[4485749.00s] through a low-pass filter but not you
[4487820.00s] know not very strictly cutoff I'm not
[4490159.00s] sure so they're not exactly the same but
[4493760.00s] they are really similar despite the fact
[4496190.00s] that they look wildly different and you
[4498380.00s] can imagine that there might be some
[4499820.00s] alien species that has a totally
[4502789.00s] different way of processing sound from
[4505130.00s] the way that we do like if they do it
[4507590.00s] visually by looking at waveforms and you
[4510800.00s] could almost imagine that that could be
[4512179.00s] the case you could design like an eye
[4513980.00s] that would take sound and turn it into
[4516860.00s] something physical that moves and sweep
[4518869.00s] it across a visual field you could I
[4521840.00s] could design a sensor that would show
[4523730.00s] you what sound looks like and that alien
[4526249.00s] species would hear these two sounds and
[4528380.00s] they would sound totally different
[4530239.00s] because these two waveforms look totally
[4532340.00s] different and we would be here with our
[4534739.00s] frequency based hearing saying yeah
[4537710.00s] those sound about the same to me maybe
[4539150.00s] just a tiny bit different and the aliens
[4540829.00s] would look at us like we had no senses
[4542960.00s] at all
[4544039.00s] so that one oh it's always struck me as
[4546260.00s] peculiar that we seem to have sensors
[4549440.00s] that only care about amplitude and don't
[4553280.00s] care about phase if you're curious about
[4556280.00s] this you can poke around that in a
[4557599.00s] little bit there's another notebook
[4560090.00s] that's in this repository that's called
[4562639.00s] phase I PI and B which is just me as a
[4565699.00s] total amateur playing around with this
[4567530.00s] people who do psycho acoustics know much
[4570079.00s] more about this and I don't want to
[4571699.00s] pretend like I'm an expert on this topic
[4574039.00s] it's just something that I found
[4575300.00s] interesting and played around with so
[4577880.00s] hopefully we'll find out more yes
[4579320.00s] question
[4580520.00s] Oh interesting the question is whether
[4588680.00s] phase is important in stereo sound and
[4591770.00s] whether we're using it in order to do
[4593960.00s] location of where a sound comes from yes
[4597260.00s] there's definitely some stuff that
[4598970.00s] happens there if you have sound coming
[4601430.00s] from two sources they interfere with
[4603380.00s] each other in ways that depend on the
[4605900.00s] phase and I think our hearing does use
[4608480.00s] that information these examples are all
[4611210.00s] mono phone I'm not you know nothing is
[4613430.00s] stereo so it's possible that I'm sort of
[4615500.00s] missing it because I'm not doing it in
[4617390.00s] stereo a good question thank you yes the
[4624740.00s] question is in wireless data
[4626210.00s] transmission the phase is absolutely
[4627920.00s] critical because yeah you're packing
[4629540.00s] information into both the phase and
[4632180.00s] amplitude part yes but I suspect that if
[4634820.00s] we listened to wireless transmissions we
[4636980.00s] wouldn't tell the difference although
[4640130.00s] they tend to be at higher frequencies
[4641690.00s] than we can hear good thank you both
[4645740.00s] good questions next section is about
[4649160.00s] chirps so far everything that we've done
[4651710.00s] has been a signal that basically has a
[4654830.00s] set of frequency components that don't
[4657230.00s] vary over time in in musical terms it's
[4660650.00s] a note that's just a constant pitch it's
[4663320.00s] not a note that goes up or down in pitch
[4666020.00s] that's what a chirp is chirp in this
[4669110.00s] example we're going to be working with
[4670460.00s] linearly increasing or decreasing
[4672890.00s] frequency and if you want to jump into
[4676400.00s] the chapter three notebook read the
[4679310.00s] first section there which introduces
[4681350.00s] this new chirp object skip over leakage
[4684140.00s] for now we're not going to talk about
[4685490.00s] that today and then get to the third
[4687770.00s] section which is about the spectrogram
[4916440.00s] if you get to this part of the notebook
[4919600.00s] that figure there is what I call the
[4921820.00s] Tower of Sauron because it kind of looks
[4924070.00s] like it this is showing you one of the
[4927220.00s] limits of just looking at a spectrum
[4929830.00s] which is that a spectrum is a holistic
[4932350.00s] view of the entire signal at once the
[4936370.00s] spectrum doesn't really know how things
[4938410.00s] are changing over time so this example
[4941500.00s] is saying that the chirp has frequency
[4945070.00s] components that start at around 200 they
[4948250.00s] end at about 400 but I can't tell from
[4951580.00s] looking at this figure whether that was
[4953620.00s] a chirp that went up over time went down
[4956920.00s] went up and then down that information
[4959620.00s] is not encoded in the spectrum what
[4963310.00s] you're seeing there is in some sense
[4964750.00s] motion blur which is that the signal the
[4969580.00s] component that makes up this signal went
[4971800.00s] from 200 to 400 but I don't know how and
[4975970.00s] that's what the spectrogram does for you
[4979090.00s] what it computes is called a short time
[4980890.00s] Fourier transform the short time means
[4984280.00s] that you're taking your long signal
[4985900.00s] breaking it up into a bunch of little
[4987790.00s] chunks and computing the Fourier
[4989890.00s] transform of each chunk and then the way
[4994090.00s] it's usually plotted and this is by
[4995920.00s] convention I've got time on the x-axis
[4998280.00s] so each column in this diagram is one
[5002310.00s] slice of time in this case it's one
[5005160.00s] second I've broken it up into about 50
[5007860.00s] pieces so each piece is about 20
[5010740.00s] milliseconds the vertical axis is
[5014580.00s] frequency so that's my usual range from
[5017610.00s] 0 to whatever my highest frequency is in
[5021300.00s] this case I cut it off at 700 just
[5023370.00s] because that's the interesting part I
[5025350.00s] didn't care about any of the higher
[5026940.00s] frequency components and the darkness of
[5029460.00s] each cell is how much energy there is so
[5032790.00s] that darkness is like the height of the
[5035400.00s] spectrum that we were looking at this
[5038160.00s] figure now tells me not only the
[5041160.00s] components that make up my signal but
[5043590.00s] also how those components are changing
[5045780.00s] over the course of the signal it starts
[5049050.00s] out at about
[5049930.00s] two-twenty and it goes up to about 440
[5052870.00s] and it goes up linearly and I can see
[5055630.00s] all of that information in the
[5057730.00s] spectrogram a spectrograph that I
[5060970.00s] couldn't see in the spectrum itself that
[5065680.00s] makes sense any questions about that
[5070020.00s] yeah yes they are so this is I want
[5077530.00s] remember which one I meant to say I
[5079060.00s] meant to say a spectrogram yeah good the
[5085120.00s] other thing that you'll see from the
[5086350.00s] notebook is that I can choose how much
[5089560.00s] time to chunk to break these chunks up
[5091840.00s] into and if I have more time if I have a
[5098230.00s] bigger chunk of time then I see more of
[5102310.00s] the signal I have more samples and I
[5105340.00s] have more information and I can use that
[5107620.00s] information to get a more precise
[5110680.00s] estimate of the frequencies so if you
[5113980.00s] compare this example this is medium
[5118870.00s] sized chunks if you like this one has
[5121840.00s] bigger chunks which means more time
[5125040.00s] which means I have a longer horizontal
[5128950.00s] chunk but a finer vertical chunk because
[5132640.00s] I can see the frequencies more clearly
[5135030.00s] the flip side is if I break it up into
[5138070.00s] lots of little tiny periods of time then
[5140890.00s] I can see time with more precision but
[5144130.00s] I'm losing information about the
[5145960.00s] frequencies in each of those chunks and
[5148650.00s] that's a trade-off it's a trade-off you
[5151510.00s] can't escape from it's called the Gabor
[5153820.00s] limit and what it says is that you have
[5156700.00s] a finite amount of information to work
[5158890.00s] with and you can either spend that
[5161350.00s] information getting more precision in
[5164170.00s] time or you can have more precision in
[5167640.00s] frequency but you can't have both and
[5171210.00s] graphically the way that works out is
[5173470.00s] that each of these little cells is the
[5177970.00s] width that corresponds to my time
[5180610.00s] precision and a height that
[5183309.00s] corresponds to my frequency precision so
[5186909.00s] the area of those little rectangles is a
[5190329.00s] constant I can have it be tall and thin
[5193359.00s] or wide and fat why didn't but I can't
[5197439.00s] have both so that's what that is
[5206769.00s] intended to show and if you have a
[5212979.00s] chance to play around with this you can
[5219789.00s] see what happens as you vary the start
[5221919.00s] frequency and the end frequency again if
[5226089.00s] you're just looking at the spectrum you
[5227679.00s] can't tell whether it's going up down or
[5230949.00s] stays the same but if you look at the
[5232719.00s] spectrogram you can one other thing I
[5238209.00s] wanted to show you so this the chirp
[5240999.00s] that we have so far is based on a
[5243339.00s] sinusoid if you look here this is the
[5252789.00s] 220 sinusoid which is at the beginning
[5255849.00s] of the chirp this is the 440 sinusoid
[5258579.00s] which is at the end of the chirped but I
[5262809.00s] can make chirps out of anything I can
[5264579.00s] take any waveform and make a Terp out of
[5267489.00s] it and the one that I played around with
[5269289.00s] a little bit is the sawtooth chirp which
[5272979.00s] is one of the exercises we're not going
[5274899.00s] to do that exercise now but if you load
[5276819.00s] up the chapter three solution you can
[5280269.00s] hear what that sounds like
[5288769.00s] so skip the first exercise the second
[5291710.00s] exercise says we're going to write a
[5293360.00s] sawtooth chirp that inherits from chirp
[5297019.00s] and it computes a sawtooth and here's
[5303409.00s] what the spectrogram looks like
[5310760.00s] and you can see that it's got a
[5312230.00s] fundamental frequency that's going up
[5314090.00s] linearly and all of its harmonics are
[5317180.00s] going up linearly so that's why it looks
[5319880.00s] like that fan is expanding and possibly
[5323390.00s] on your screen but not up here you might
[5326450.00s] be able to see what happens when those
[5328070.00s] high-frequency components hit the top of
[5331400.00s] the spectrogram the top of the
[5333680.00s] spectrogram is the cutoff frequency so
[5337490.00s] play around with that a little bit and
[5338810.00s] then listen to the sawtooth chirp and
[5341210.00s] I'll come back in just a minute
[5378499.00s] if you like you can do what I just did
[5380860.00s] which is I turned the framerate down
[5384039.00s] from ten thousand to four thousand so
[5387769.00s] that has the effect of lowering the
[5389300.00s] folding frequency down to two thousand I
[5391900.00s] also changed the length of the
[5394610.00s] spectrogram in time or actually a number
[5397340.00s] of samples I turned it down to 256
[5400280.00s] samples and now you can see the
[5403610.00s] frequency components a little bit more
[5406969.00s] clearly and you can see that when the
[5410360.00s] high-frequency components run up against
[5412519.00s] the top which is the folding frequency
[5415010.00s] they bounce off
[5417130.00s] they reflect down into the part of the
[5423050.00s] range that I can perceive that's what
[5427070.00s] aliasing looks like in a spectrogram
[5433179.00s] let's see what that sounds like so
[5443179.00s] that's what you get if you take a
[5444409.00s] sawtooth chirp and sample it at a kind
[5448130.00s] of low cutoff frequency so we've put it
[5450260.00s] through a filter but we also have a
[5452929.00s] bunch of aliasing going on and the
[5454579.00s] aliasing is contributing some frequency
[5459039.00s] harmonics does that sound familiar to
[5462320.00s] anybody yes that is the red alert from
[5467030.00s] the original Star Trek series and if you
[5470059.00s] remember that those were made in the I
[5471920.00s] think 1968 69 they didn't have a lot of
[5476749.00s] synthesizers to work with but generating
[5480320.00s] a sawtooth chirp so that's pretty much
[5487010.00s] what that special effect is because I
[5489440.00s] always think that that's what you want
[5490639.00s] if you're dealing with a life-and-death
[5492170.00s] emergency what you really want
[5506869.00s] okay if you're interested in chirps and
[5514760.00s] spectrograms there's an excellent video
[5518520.00s] game sort of that you can play that will
[5521789.00s] play actual chirps like bird chirps and
[5524210.00s] we'll show you the spectrogram of a
[5527039.00s] particular bird and your job is to match
[5529139.00s] up the spectrogram with the
[5530639.00s] corresponding signal which is pretty
[5533400.00s] good for starting to develop some
[5535020.00s] intuition for what that correspondence
[5537510.00s] is like if you want to some time on your
[5540690.00s] own time not mine try out bird song hero
[5544110.00s] and see what you think of it we're gonna
[5545699.00s] take another break in half an hour so
[5547829.00s] play with bird song hero during that
[5549780.00s] break next thing we're gonna do is talk
[5553980.00s] about convolution and this is the second
[5556050.00s] big part of what we're talking about
[5557550.00s] today we've talked about spectrums and
[5559380.00s] spectrograms now we're going to start
[5561150.00s] talking about convolution I'm going to
[5563280.00s] start with smoothing because this is a
[5565230.00s] kind of convolution that many of you are
[5567599.00s] probably familiar with and then we'll
[5569400.00s] work our way up from there so one way to
[5571889.00s] smooth out a noisy signal is to compute
[5574889.00s] a moving average moving average in if
[5578099.00s] you look at things like finance what
[5580050.00s] you'll do is you'll take the last you
[5581699.00s] know 10 days or the last three quarters
[5584010.00s] of data and compute the average over
[5587760.00s] that period of time and then you're
[5589920.00s] going to just shift that period of time
[5591989.00s] that's why it's called a moving window
[5593369.00s] you're gonna shift that window over time
[5596039.00s] and compute the moving average the
[5598440.00s] result that you get looks smoother than
[5602250.00s] what you started with and this is an
[5604530.00s] example this is actually the daily
[5606300.00s] clothes for Facebook for I think the
[5608820.00s] first two or three years after their
[5610530.00s] initial public offering and you can see
[5613110.00s] the gray line there is the original
[5615539.00s] unsmooth data and the blue line is a 30
[5619559.00s] day moving average so what this looks
[5624210.00s] like in signal processing land is I've
[5627989.00s] got this signal that's a function of
[5629909.00s] time and I've got this window and in
[5633150.00s] this
[5633390.00s] case the window is I think it's 11
[5636140.00s] samples long so what it means I'm gonna
[5639060.00s] take the first 11 samples average them
[5641640.00s] together and then I shift the window
[5643830.00s] over by one I'm gonna take the next 11
[5646970.00s] overlapping samples so first it's 1
[5650160.00s] through 11 and then 2 through 12 and
[5652560.00s] then 3 through 13 and so on that
[5657000.00s] operation where you take that window you
[5660990.00s] multiply it by the signal and add it up
[5663980.00s] then you shift the window over by 1
[5666650.00s] multiply add shift multiply add shift
[5669750.00s] that operation is convolution here it is
[5674760.00s] in words I think in the notebook you'll
[5677010.00s] see the mathematical version so I'm
[5679290.00s] going to take my signal multiplied by
[5680880.00s] the window add up the product and I'm
[5684060.00s] gonna write that down that's the first
[5685320.00s] result shift the window and repeat
[5687990.00s] that's how you do a moving window
[5689970.00s] average here's one way to do it in
[5694830.00s] Python this is a wildly inefficient way
[5697530.00s] to do it in Python but I'm gonna start
[5700650.00s] by initializing smooth that's the space
[5703980.00s] that the result is going to go into I'm
[5706260.00s] gonna create the window and this is the
[5708570.00s] thing that I'm going to shift over by 1
[5710430.00s] each time and then I'm gonna loop
[5712650.00s] through my entire signal each time
[5715350.00s] through I'm gonna multiply the rolled
[5718530.00s] window the window that's been shifted by
[5721650.00s] the wave the wise there are the
[5724740.00s] components of the wave and then add them
[5726900.00s] up and then repeat rather than get
[5731460.00s] bogged down in the details here you're
[5732960.00s] gonna see this in the notebook so let's
[5734970.00s] jump into that if you open up chapter 8
[5737460.00s] and run the sections that are called
[5739860.00s] smoothing and then smoothing sound
[5741750.00s] signals will come back in a couple
[5743430.00s] minutes
[6066579.00s] okay a couple of things you might want
[6068110.00s] to try out in the notebook I got a
[6069790.00s] really good question that I wanted to
[6071139.00s] answer up here so I'm gonna create my
[6073599.00s] original signal and then I'm going to
[6075400.00s] create this window and the window is 11
[6079540.00s] samples long and it's the same height
[6082150.00s] all the way across and it adds up to one
[6085090.00s] the reason I'm doing this line here is
[6087849.00s] to make it add up to 1 that's just so
[6090159.00s] it's not making my signal any louder or
[6092619.00s] any quieter the average amount of energy
[6095110.00s] will be the same I'm just smoothing it
[6097179.00s] out so this is a flat line between 0 and
[6100840.00s] 10 so it has 11 elements in it and then
[6104290.00s] here's what my wave looks like now I'm
[6107889.00s] going to take my window and I'm gonna
[6109570.00s] Pat it with 0 so I'm adding a whole
[6111849.00s] bunch of zeros to it so this is the
[6114190.00s] first 11 points are the same as what we
[6116770.00s] were just looking at a minute ago but
[6118270.00s] now it's got a whole bunch of zeros and
[6120309.00s] those are there so that the window and
[6123340.00s] the signal are the same length which is
[6125559.00s] why I can multiply the two of them
[6127090.00s] together now what's going to happen each
[6131170.00s] time I take one step through I'm gonna
[6134590.00s] shift the window one step to the right
[6138300.00s] so if you go and you do the whole thing
[6143579.00s] then the rolled window comes all the way
[6146710.00s] back to the beginning again and it looks
[6148300.00s] like it never moved but if you want
[6150489.00s] change this to like n over two so that I
[6154869.00s] only compute the first half of this
[6157809.00s] result the only reason I'm doing that is
[6160659.00s] so that we can see that the window is
[6162940.00s] halfway along and if you do a quarter
[6166059.00s] you'll see that it's a quarter of the
[6167409.00s] way along and so on so that's what's
[6172719.00s] going on there
[6178570.00s] and the result okay so in this case I've
[6181660.00s] only computed one quarter of the results
[6183490.00s] so it's messed up so I got to put it
[6184990.00s] back but if you put it back you'll see
[6188260.00s] what the result looks like which is not
[6190660.00s] wildly different from the original
[6192090.00s] there's a little bit at the end there
[6194560.00s] that's getting messed up and that's
[6196300.00s] getting messed up because of the
[6197650.00s] wraparound this is one of the issues
[6199750.00s] that you run into with convolution I'm
[6201700.00s] not going to deal with it a lot today
[6203140.00s] I'm just kind of kind of wave my hands
[6204820.00s] and ignore the issue but dealing with
[6206980.00s] the boundary conditions the beginning
[6208810.00s] and the end of the signal is a recurring
[6211210.00s] issue anytime you're working with
[6213070.00s] convolution but as I said I'm gonna
[6215140.00s] ignore it for now now that thing that we
[6218020.00s] just computed is ridiculously
[6220810.00s] inefficient in Python almost any time
[6223930.00s] you find yourself writing a loop in
[6225460.00s] Python to do this kind of numerical
[6227710.00s] computation it's not going to be fast
[6229960.00s] fortunately the nice people at numpy
[6232180.00s] have solved this problem for us which is
[6234580.00s] that they wrote convolve and convolve
[6236950.00s] does what we just did so the result is
[6239230.00s] very similar except that it was fast and
[6243280.00s] the reason it was fast is that it's
[6244810.00s] running inside of a library that I think
[6246670.00s] is probably written in C so it's gonna
[6249220.00s] go a lot faster good so far all right so
[6257590.00s] what we took what we did there was a
[6259150.00s] moving average and instead of applying
[6261820.00s] it to the facebook stock we applied it
[6264460.00s] to a sawtooth and what we got is a
[6266860.00s] signal that's a little bit smoother than
[6269380.00s] what the original sawtooth looked like
[6271270.00s] and if you listen to it you probably got
[6274330.00s] a sense that okay yeah some of the
[6275620.00s] high-frequency components have been
[6277740.00s] erased there so if we look at the signal
[6282870.00s] visually it looks like we've taken some
[6285340.00s] of the corners and smooth them out just
[6286990.00s] a little bit so what does that mean
[6290050.00s] about the spectrum and you can look at
[6293770.00s] what that looks like in the notebook
[6297570.00s] this is the spectrum of the original in
[6300850.00s] gray and the spectrum of the output
[6303970.00s] after convolution in blue what does that
[6307570.00s] look like to you
[6313530.00s] if it's not clear up here you should be
[6315969.00s] seeing the same thing in your notebook
[6317320.00s] you might be able to see it more clearly
[6320010.00s] are you stretching or bravely
[6322090.00s] volunteering to answer a question it's
[6325749.00s] kind of looking like a low-pass filter
[6327300.00s] the low frequency components seem to
[6329949.00s] have got through the smoothing with a
[6332679.00s] little bit they've been decreased a
[6334480.00s] little bit the high-frequency components
[6336159.00s] have been all but removed so we now have
[6340539.00s] two views of this operation
[6342519.00s] when you apply convolution you can think
[6345579.00s] of it as smoothing if you look at the
[6348039.00s] waveform and you can think of it as a -
[6351039.00s] as a low-pass filter if you look at the
[6354039.00s] spectrum and those are equivalent ways
[6356530.00s] to think of the same operation but
[6359530.00s] they're being expressed in the time
[6360940.00s] domain and the frequency domain what I
[6363309.00s] mean by that the domain of a function is
[6365650.00s] the x axis if the x axis is time then
[6369789.00s] you are describing a wave as a function
[6372159.00s] of time if you're in the frequency
[6374590.00s] domain you are describing a spectrum as
[6377199.00s] a function of frequency but those are
[6380650.00s] equivalent ways to represent the same
[6382659.00s] information as we saw you can take a
[6385179.00s] wave and compute its spectrum you can
[6387340.00s] take a spectrum and compute its wave and
[6389889.00s] that gives you the ability to go back
[6391329.00s] and forth between the time domain and
[6393190.00s] the frequency domain in the same way you
[6396309.00s] can think of every operation that you
[6398260.00s] perform like smoothing is in operation
[6400440.00s] you can think of it as having an effect
[6402789.00s] on the wave or you can think of it as
[6404619.00s] having an effect on the spectrum it's
[6406809.00s] just two ways of describing the same
[6408519.00s] thing so this is my conjecture we're
[6412809.00s] sort of discovering the convolution
[6415239.00s] theorem by exploring the conjecture is
[6417789.00s] that when you smooth the signal in the
[6419440.00s] time domain what you're doing is
[6421929.00s] applying a low-pass filter in the
[6423969.00s] frequency domain so we might think okay
[6426849.00s] well what kind of filter is it can we
[6428440.00s] characterize the filter one way to think
[6431110.00s] about this is this diagram which we're
[6433059.00s] going to see over and over is a way of
[6435070.00s] describing the time domain across the
[6438429.00s] line and the frequency domain across the
[6442269.00s] bottom so the left hand
[6444600.00s] there that's my wave the input wave on
[6448320.00s] top that's my original sawtooth in the
[6451470.00s] bottom left that's the spectrum of the
[6454050.00s] sawtooth the top right is the output
[6458820.00s] that's the gray smooth sawtooth and the
[6462930.00s] bottom right is the out there's the
[6465540.00s] spectrum of the output that's what it
[6467490.00s] looks like after it's been low-pass
[6469380.00s] filtered in the middle I've got my
[6473010.00s] window and it's the square window that
[6476550.00s] sometimes called a box car window
[6478230.00s] because it looks like a box that's being
[6480900.00s] shifted along a track so that's my box
[6483330.00s] car window the conjecture is that if we
[6486630.00s] convolve my signal with the window in
[6490260.00s] the time domain that that's the same as
[6492720.00s] taking the spectrum and doing something
[6496140.00s] with it applying a filter in the
[6499020.00s] frequency domain and now I would like to
[6501720.00s] figure out what filter is it and I'm
[6504540.00s] going to do that by working backwards
[6506160.00s] which is I'm gonna take the output
[6509010.00s] spectrum and divide it by the input
[6511530.00s] spectrum and that will tell me how much
[6514470.00s] each frequency component has been
[6516300.00s] attenuated by so this is maybe we can
[6521970.00s] characterize the filter we can figure
[6523440.00s] out what we did to the spectrum by
[6526260.00s] comparing the output spectrum and the
[6528540.00s] input spectrum in code it looks like
[6530970.00s] this I'm going to take the output which
[6533490.00s] is amplitudes 2 and divide it by the
[6536490.00s] input which is the amplitudes amps and
[6538980.00s] then I have to do a little bit of a
[6540870.00s] tweak which is in the places where I
[6543570.00s] don't have very much energy this
[6545580.00s] division is going to be really noisy
[6547440.00s] because the denominator is small so I'm
[6550260.00s] going to avoid that I'm gonna take all
[6551850.00s] the places where the amplitude is low
[6553530.00s] and I'm just going to clobber that stuff
[6555540.00s] and what I get is in the frequency
[6559590.00s] domain part of the notebook which is
[6564630.00s] this
[6567149.00s] so take a minute get back into the
[6568619.00s] notebook I'll come around and answer
[6570719.00s] questions and then we'll look at the
[6571889.00s] next part
[6657380.00s] what this figure is showing you is what
[6661219.00s] the filter looks like it is a low-pass
[6663650.00s] filter because you can see that the low
[6665900.00s] frequencies everything below about 3000
[6668480.00s] is going through the filter mostly
[6670909.00s] unchanged and all the high-frequency
[6673280.00s] components are being cut off the
[6676580.00s] vertical axis there is about 20 percent
[6678440.00s] down to about 10 percent so they're
[6680960.00s] being attenuated by a factor of about 10
[6684070.00s] all right interesting it's a low-pass
[6686690.00s] filter but it's a weird low-pass filter
[6688699.00s] it's got all these bouncy parts to it
[6691550.00s] what's going on there well if it go back
[6694639.00s] to this diagram we've figured out what
[6697489.00s] the filter looks like it looks like this
[6699230.00s] bouncy gray line but we still don't know
[6703010.00s] what that function is well why is it
[6704960.00s] bouncy why is it like that well one way
[6707719.00s] to read this diagram is again to think
[6709940.00s] well okay the top line is the time
[6711949.00s] domain the bottom line is the frequency
[6714139.00s] domain I always get from the top to the
[6717110.00s] bottom by computing the discrete Fourier
[6719630.00s] transform so over there on the Left I
[6723350.00s] take my original wave a computed
[6725600.00s] spectrum and I get the spectrum okay
[6728330.00s] over here I take my output and I compute
[6731780.00s] the spectrum of the output so here's my
[6734540.00s] conjecture and this is the convolution
[6736520.00s] theorem is I suspect that that filter is
[6740360.00s] the Fourier transform of my window and
[6744100.00s] you can test that that's what's in the
[6746360.00s] notebook and here's what it looks like
[6750380.00s] again the conjecture the convolution
[6752179.00s] theorem says that when I convolve with a
[6754610.00s] window in the time domain that
[6757010.00s] corresponds to taking the spectrum and
[6759889.00s] multiplying it by a filter in the
[6762320.00s] frequency domain and the filter in the
[6766790.00s] frequency domain is the DFT of the
[6769340.00s] window in the time domain
[6772510.00s] that's the convolution theorem here is
[6776389.00s] my graphical proof of the convolution
[6779300.00s] theorem which is the blue lines there
[6782150.00s] that's what I computed by taking the
[6784850.00s] ratio of the output and the input that's
[6788360.00s] in some sense the experimental result
[6790340.00s] and
[6791090.00s] the gray line is the theoretical result
[6793010.00s] that gray line is the DFT of my window
[6796550.00s] and they match up pretty well so that
[6803990.00s] now gives me this way of representing
[6806750.00s] what we've learned so graphically what
[6809840.00s] it means is that I can do convolution in
[6812480.00s] the time domain that's the top row or I
[6815810.00s] can do multiplication in the frequency
[6818240.00s] domain that's the bottom row and they
[6821090.00s] work out the same way and I should
[6823520.00s] explain the notation there
[6824870.00s] the star is convolution and the circle
[6828530.00s] is just plain old element wise
[6830300.00s] multiplication I'm taking each frequency
[6833000.00s] component and multiplying by the
[6835340.00s] corresponding component in the filter if
[6838880.00s] you speak math that's the Hadamard
[6840440.00s] product of those two vectors so this
[6847700.00s] says that convolution in the time domain
[6850390.00s] corresponds to element wise
[6852530.00s] multiplication in the frequency domain
[6857710.00s] one way to think about this graphically
[6860180.00s] is if you want to compute the lower
[6861950.00s] right-hand corner there are now two ways
[6864950.00s] to do it
[6865700.00s] one way is I can do the convolution
[6868970.00s] first and then the DFT that's the orange
[6872780.00s] path that says take the wave convolve
[6876200.00s] with the window and then compute the DFT
[6878800.00s] or I can take the green path the green
[6882440.00s] Bath says take the DFT of the wave take
[6885980.00s] the DFT of the window and then just do
[6889250.00s] multiplication the convolution theorem
[6892310.00s] is telling me that those two paths are
[6894200.00s] equal in either case I get the spectrum
[6896780.00s] of the output and that is the one slide
[6902240.00s] version of the convolution theorem good
[6910230.00s] questions yeah how would you compute the
[6918840.00s] DFT of the window yes good question the
[6923970.00s] window is moving so how do i compute its
[6926100.00s] DFT I can just take a static view of
[6928710.00s] that window it actually doesn't matter
[6931320.00s] where in time it is because when I shift
[6934590.00s] it in time that's a phase offset so it
[6939989.00s] will show up in the phase part of the
[6942330.00s] DFT but here I'm just showing the
[6945270.00s] amplitudes great question that's my next
[6955710.00s] slide question was is one of these more
[6960450.00s] computationally efficient than the other
[6962040.00s] and the answer is yes that the orange
[6965730.00s] line computing convolution in the time
[6968130.00s] domain is a quadratic operation it's
[6971160.00s] proportional to N squared where n is the
[6973950.00s] size of the array computing the Fourier
[6976710.00s] transform that the FFT and this is why
[6979800.00s] the FFT is such an important algorithm
[6982020.00s] takes n log n time and log in is better
[6986040.00s] than quadratic and even doing two of
[6988920.00s] them is still better than quadratic and
[6991350.00s] even doing two of them and then doing
[6993510.00s] element wise multiplication because
[6995790.00s] that's just linear is still better than
[6998250.00s] quadratic so even though the green line
[7000739.00s] seems like it's more operations it is
[7003160.00s] computationally more efficient and this
[7006050.00s] is in fact a nice way to compute
[7008320.00s] convolutions which is to do everything
[7010190.00s] in the frequency domain all right we
[7016100.00s] will take our second we're running just
[7018050.00s] a little late let's take our second
[7019670.00s] break now and we'll come back in ten
[7021710.00s] minutes which is going to be 340
[7777170.00s] okay we are back what have we learned
[7780890.00s] all right we learned that when you do
[7783740.00s] convolution in the time domain it
[7785710.00s] corresponds to multiplication by a
[7788870.00s] filter in the frequency domain and that
[7791990.00s] filter is the Fourier transform of the
[7795260.00s] window good the other thing that we
[7797990.00s] learned is that a boxcar window which is
[7801470.00s] a smoothing window corresponds to a
[7803930.00s] low-pass filter but it's not a very good
[7806720.00s] low-pass filter because what you want in
[7808910.00s] a low-pass filter is ideally everything
[7811970.00s] below the cutoff frequency should go
[7814160.00s] through the filter totally unchanged and
[7816290.00s] everything above the cutoff frequency
[7818060.00s] should get removed completely but that's
[7821060.00s] not what we're getting we're getting
[7822530.00s] these weird bouncy things where some of
[7825500.00s] my high-frequency components are getting
[7827390.00s] totally eliminated but some of them are
[7829550.00s] still there they're reduced by a factor
[7832040.00s] of 10 but that's not good enough I want
[7834200.00s] to get rid of those bouncy things so the
[7837050.00s] question is how do I design a better
[7839350.00s] window in the time domain to correspond
[7842780.00s] to a better filter in the frequency
[7844670.00s] domain and my conjecture is that a
[7847790.00s] Gaussian window might help because what
[7851150.00s] I'm going to do is I'm going to take the
[7852380.00s] sharp edges of my boxcar window and I'm
[7855860.00s] gonna round them off and I'm gonna make
[7857690.00s] a nice smooth window in the time domain
[7859960.00s] the reason is because a smooth window in
[7863240.00s] the time domain will correspond to a
[7865460.00s] sharper cutoff in the frequency domain
[7867880.00s] if you go back into chapter 8 and go
[7871970.00s] down to the section that says Gaussian
[7873710.00s] window there's an interactive widget
[7876050.00s] there that you can play around with to
[7877760.00s] explore what I just said play with it
[7880790.00s] and I'll show you some results in a
[7882380.00s] minute
[8150739.00s] okay I want to play around with this a
[8152750.00s] little bit so the two parameters here
[8155650.00s] standard deviation STD is the width of
[8159410.00s] this Gaussian curve so this is if you're
[8162170.00s] familiar with a bell curve or a normal
[8163790.00s] distribution this is mathematically the
[8166010.00s] same as that it's not a probability
[8168020.00s] distribution so if you're thinking about
[8169640.00s] that that's just confusing but this is
[8171739.00s] the window that I'm gonna use instead of
[8174410.00s] the boxcar which just goes from 0 to 1
[8177739.00s] instantly so it's got that discontinuity
[8180230.00s] this is nice and smooth no
[8182360.00s] discontinuities it ramps up curbs over
[8185330.00s] the top and ramps back down if you take
[8188180.00s] the standard deviation and make it
[8190280.00s] smaller then what you're doing to the
[8194240.00s] window is you're making the window
[8196130.00s] narrower and narrower which means that
[8199040.00s] you are adding up fewer elements from
[8202309.00s] the wave which means that you're doing
[8204800.00s] less and less smoothing which means that
[8208190.00s] you are making the cutoff of the filter
[8211010.00s] higher and higher so as I make standard
[8213830.00s] deviation go down the window on the left
[8216889.00s] is getting narrower and the cutoff
[8220460.00s] frequency on the right is shifting off
[8223400.00s] to the right eventually I get down to
[8226099.00s] the point where my standard deviation is
[8228170.00s] really small which means my window is
[8230510.00s] really small which means I'm not doing
[8232580.00s] any smoothing which means that my filter
[8234800.00s] is basically doing nothing go the other
[8239000.00s] direction start cranking up the standard
[8241190.00s] deviation the window is getting wider
[8243679.00s] which means that I'm adding up more
[8245900.00s] elements which means that I'm doing more
[8248030.00s] smoothing which corresponds in the
[8250550.00s] frequency domain to a lower cutoff but
[8256429.00s] then I start to run into something funny
[8258290.00s] as I make the standard deviation bigger
[8261740.00s] and bigger my cutoff is getting lower
[8264769.00s] and lower but the quality of my filter
[8269510.00s] is starting to get bad and I can see
[8272750.00s] that in two ways when I look at the
[8275179.00s] spectrum on the right I can see that
[8277700.00s] those bouncy high frequency components
[8280010.00s] are coming back I don't like those
[8282469.00s] because that means that I'm not
[8284149.00s] attenuating the high frequencies by as
[8286099.00s] much as I wanted to the other thing you
[8288949.00s] can see and on the left is that my
[8291800.00s] window is getting worse and worse
[8293499.00s] because it's not a smooth Gaussian curve
[8296419.00s] anymore
[8297229.00s] it's a Gaussian curve that's getting cut
[8299269.00s] off at the edges and those edges are
[8302689.00s] creating sharp discontinuities sharp
[8306889.00s] discontinuity in the time domain is
[8309139.00s] corresponding to high frequency
[8311059.00s] components in the frequency domain
[8312679.00s] that's where those bouncy things are
[8315019.00s] coming from one way to get rid of them
[8318199.00s] is by making the window bigger so that I
[8321949.00s] get a bigger slice of the Gaussian as I
[8326539.00s] make this bigger I my window is now a
[8329269.00s] better and better approximation of a
[8331789.00s] Gaussian and my filter is getting to be
[8335389.00s] a better and better filter because those
[8337340.00s] high frequency bouncy components are
[8339409.00s] going away how's that making sense
[8347380.00s] alright so part of what we learned there
[8352819.00s] is that if you have a wider window in
[8354889.00s] the time domain you are adding up more
[8356989.00s] components you're adding up more samples
[8358999.00s] I should say which means that you're
[8361130.00s] applying more smoothing and more
[8363380.00s] smoothing means a lower cut off
[8366019.00s] frequency for your low-pass filter but
[8371749.00s] the other thing that we saw is if the
[8373219.00s] standard deviation is really wide which
[8375529.00s] means that your bell curve is really
[8376999.00s] wide but your value of M is too small
[8380359.00s] then you're taking your nice smooth
[8382550.00s] Gaussian you're cutting off the edges
[8384800.00s] and those sharp edges that you've
[8387439.00s] introduced caused the extra frequency
[8390739.00s] components to come back so that is the
[8397220.00s] second yes question
[8404030.00s] is there a ratio of these two things
[8406590.00s] that makes it work one way to think
[8408660.00s] about it is that you need em to be big
[8411811.00s] enough that the edges of your window are
[8414960.00s] pretty close to zero it's a little bit
[8418050.00s] like making pie which is that you want
[8420660.00s] the crust you can have the crust kind of
[8422820.00s] piled up on the middle of the pie but
[8424980.00s] when it comes down to the edge of the
[8426511.00s] pie you need to make a good seal at the
[8428820.00s] beginning and the end in the case of pie
[8431431.00s] that means that you don't have fruit
[8432900.00s] that comes spilling out and it falls
[8434700.00s] onto the bottom of the oven and burns
[8436920.00s] and make smoke in the case of a filter
[8439380.00s] what it means is that you've crimped
[8441480.00s] down the edges of your filter so that
[8443070.00s] you don't have discontinuities because
[8445740.00s] discontinuities is bad a little bit of a
[8449370.00s] stretch for a metaphor but hopefully
[8451200.00s] that makes sense all right we've got the
[8458370.00s] discrete Fourier transform we've got the
[8460471.00s] convolution theorem the third piece that
[8462811.00s] I mentioned all the way at the beginning
[8464311.00s] was LTI Theory linear time-invariant
[8467271.00s] theory to understand LTI we have to
[8471240.00s] introduce the idea of what a system is a
[8473490.00s] system is anything that takes a signal
[8476641.00s] as an input and produces a signal as an
[8479400.00s] output so you can think of this as
[8481351.00s] practically any electronic component you
[8484290.00s] can put a time varying signal in you get
[8487440.00s] a time varying signal out it's true of
[8489750.00s] mechanical systems too which is that you
[8491880.00s] can put a vibration in on one end of a
[8494971.00s] mechanical structure and you the other
[8497070.00s] end will vibrate as well you can think
[8499830.00s] of it as sound like in a room so the
[8502830.00s] sound that's leaving my mouth is while
[8505080.00s] it's going through a microphone but it's
[8506761.00s] coming from speakers and it's going to
[8508500.00s] your ear so the room is behaving like a
[8510900.00s] system that takes input from me and you
[8513990.00s] hear the output on your end to say that
[8518190.00s] a system is LTI means that it has two
[8520771.00s] properties it has to be time invariant
[8522870.00s] that's the TI and linear let me do time
[8525360.00s] invariant first time invariant means
[8527910.00s] that the system has the same effect on
[8530130.00s] the same signal regardless of the time
[8532771.00s] of day an LTI system in some sense
[8535740.00s] no clock it has no sense of things that
[8539250.00s] change over time other than the signal
[8541760.00s] so mathematically what that means is if
[8544830.00s] input one produces output one today then
[8549780.00s] it will produce the same output given
[8551460.00s] the same input tomorrow and until the
[8553650.00s] end of time okay so for the system to be
[8556980.00s] time invariant means same input same
[8559351.00s] output to say that the system is linear
[8562851.00s] means that if I put two signals in
[8566010.00s] separately or if I put them in together
[8568410.00s] the effect is the same a little bit more
[8571771.00s] rigorously what that means is if I've
[8573780.00s] got one input that produces one output
[8576480.00s] so input one produces output 1 input 2
[8579721.00s] produces output 2 if I take the inputs
[8582721.00s] and add them together the output of the
[8584971.00s] system will be the sum of the outputs
[8587721.00s] that's what it means to say that it's
[8589771.00s] linear by and large this is what you
[8592170.00s] expect from audio equipment and what you
[8594990.00s] expect from the acoustics of a room that
[8597030.00s] if you have two people talking at the
[8598891.00s] same time what you hear is the sum of
[8601710.00s] the two inputs and in fact it is pretty
[8607830.00s] much true that acoustics are LTI that
[8611101.00s] most rooms are pretty well modeled by an
[8614311.00s] LTI system it's not nothing in the real
[8617370.00s] world is ever strictly speaking exactly
[8620160.00s] mathematically true but by and large
[8622620.00s] acoustics is pretty much LTI so one way
[8627360.00s] to think about it that I defined LTI I
[8629431.00s] want to say a little bit about ok so
[8631351.00s] what does that mean what are the
[8632311.00s] consequences of that definition one way
[8634920.00s] to think about it is what could a room
[8638221.00s] do to a sound well one thing that it can
[8642300.00s] do is it can introduce a delay so there
[8645210.00s] can be a time delay between when the
[8647730.00s] input goes in and when the output comes
[8649620.00s] out it can cause an echo so what you're
[8655200.00s] actually hearing right now is not the
[8657990.00s] signal that I'm generating you are
[8659971.00s] hearing many many copies of the signal
[8663061.00s] that I'm generating that are delayed by
[8665490.00s] different amounts because what you're
[8667891.00s] hearing is partly the strain
[8669450.00s] line between me and you but it's also
[8671610.00s] bouncing off walls and you can think of
[8674550.00s] every possible path between me and you
[8676920.00s] is a different delay so you're hearing
[8680130.00s] many many delayed copies and some of
[8684000.00s] them are louder than others because the
[8687450.00s] longer the path the less amplitude there
[8690510.00s] is when it finally gets to you so that's
[8693000.00s] what an acoustic system can do some of
[8696210.00s] the things that it can't do by and large
[8699061.00s] if you're just talking about a room
[8700230.00s] which is a passive system
[8702120.00s] it can't output any more energy than is
[8705240.00s] going in so there's no way that what
[8707820.00s] you're hearing is louder than what I'm
[8709650.00s] producing well other than the fact that
[8711660.00s] we have an amplifier so that is messing
[8713521.00s] up my example but normally in a room
[8716130.00s] that doesn't have amplifiers in it the
[8718620.00s] total energy has to be conserved the
[8721860.00s] other thing an LTI system can't move
[8724561.00s] energy from one frequency to another so
[8728070.00s] if I were up here and I had a tuning
[8730021.00s] fork and I played precisely 440 Hertz
[8733620.00s] you might hear it loud you might hear it
[8736590.00s] quiet
[8737190.00s] you might hear it delayed you might hear
[8739230.00s] many delayed copies but you will never
[8741870.00s] hear anything other than 440 Hertz and I
[8746940.00s] use a tuning fork because that produces
[8748561.00s] a pretty pure sinusoid without any other
[8751440.00s] frequency components all right so you
[8754500.00s] can't move energy around this the
[8756630.00s] mechanical system I have there that's
[8758250.00s] from a patent that is a mechanical
[8760710.00s] frequency doubler that is an example of
[8763620.00s] a mechanical system where if you put a
[8765780.00s] vibration into it at 440 Hertz it will
[8768931.00s] output a vibration at 880 Hertz it's not
[8772891.00s] easy to design one of those which is why
[8774990.00s] it has a patent but that would be an
[8776910.00s] example of a system that is not LTI
[8779220.00s] because it violates exactly this this
[8782420.00s] restriction however if the system is LTI
[8788460.00s] what that means is that I can describe
[8790860.00s] the room acoustically I can summarize
[8793650.00s] its acoustic properties just by telling
[8796440.00s] you what it does to each frequency
[8798300.00s] component in other words if I know for
[8801750.00s] this room
[8802350.00s] I know that it will attenuate different
[8805080.00s] frequencies by different amounts if I
[8807750.00s] can figure out how much it attenuates
[8809670.00s] each frequency then I know everything
[8812580.00s] about the room that I need to know
[8813899.00s] that's what I mean when I say
[8815369.00s] characterize a system what I mean is I
[8818310.00s] know what it does to every possible
[8820340.00s] frequency component so there are a
[8824159.00s] couple of ways that I could do this and
[8825930.00s] one of them let's say that I wanted to
[8828510.00s] go into a famous building like a
[8830430.00s] cathedral and I wanted to characterize
[8833040.00s] its acoustic performance because people
[8835560.00s] say oh this is such a great space for
[8837239.00s] music alright I want to reproduce that
[8839369.00s] so how could I measure the acoustic
[8842489.00s] response of a space well one possibility
[8846119.00s] is I could play one frequency at a time
[8848310.00s] and you could think of it like you know
[8850170.00s] almost like a piano if you had a piano
[8851729.00s] that just produces one pure tone at a
[8854970.00s] time I would just play each note on the
[8856859.00s] piano and I would record the output and
[8859710.00s] then I would have a spectrum that tells
[8863220.00s] me for every frequency how how did it
[8867180.00s] get through the system what was the
[8868979.00s] output for each input I could play one
[8873239.00s] note at a time or I could sweep through
[8876359.00s] a range of frequencies I could play like
[8878189.00s] a chirp and that was part of the reason
[8879960.00s] that I wanted to show chirps earlier is
[8881550.00s] that that's another way to characterize
[8882869.00s] a system is just do a frequency sweep if
[8886290.00s] you've done some electrical engineering
[8887760.00s] you have probably done this which is one
[8889920.00s] of the ways to characterize an
[8891300.00s] electronic circuit is to sweep through a
[8893609.00s] range of frequencies and measure the
[8895109.00s] outputs but the other possibility is if
[8898560.00s] the system is linear then that means I
[8901619.00s] don't have to put the frequency
[8903180.00s] components in one at a time I can add
[8905790.00s] them all up I can input all the
[8908340.00s] frequencies at the same time and the
[8911040.00s] output will be the same as if I did them
[8913680.00s] all individually and then added them up
[8916340.00s] so the next question then is if I want
[8920460.00s] to input all the frequencies at the same
[8922560.00s] time what should i input into the system
[8928340.00s] what does a signal look like that
[8931529.00s] contains all frequencies
[8935360.00s] well now you're getting ahead of things
[8940190.00s] now so one white noise is one
[8942990.00s] possibility white noise on average has
[8945990.00s] the same amount of energy at all
[8947761.00s] frequencies and in fact white noise is
[8950160.00s] one of the ways to characterize a room
[8953181.00s] but you might have to run the white
[8955230.00s] noise for a long time because it's only
[8956761.00s] true on average it's not true at every
[8959011.00s] in any particular chunk well if I'm
[8964171.00s] trying to figure out what wave looks
[8966780.00s] like if I know what the spectrum looks
[8969211.00s] like I can work backwards so this is the
[8971940.00s] spectrum I want this is the spectrum
[8974461.00s] that contains equal energy at all
[8976891.00s] frequencies well if I give me a wave I
[8981480.00s] know how to get the corresponding
[8982681.00s] spectrum well give me a wave sorry you
[8986070.00s] give me a spectrum I know how to get the
[8987631.00s] car spawning wave
[8988711.00s] I just compute the inverse discrete
[8990841.00s] Fourier transform and that's what I get
[8995541.00s] so on the left is the spectrum equal
[8999330.00s] power at all frequencies on the right is
[9001851.00s] the wave and it is a spike it is zero
[9006440.00s] everywhere and then one or some
[9009860.00s] arbitrary value at one location it is as
[9013490.00s] close as we can get mathematically to a
[9015530.00s] delta function so step function is
[9018261.00s] really close step function is the
[9019580.00s] integral of this which is also good but
[9022101.00s] this is the input that has all the
[9025761.00s] frequency components that thing is
[9027501.00s] called an impulse something that's zero
[9029931.00s] and then jumps to a value and then jumps
[9032780.00s] right back down that's the impulse so
[9035601.00s] what I'm going to do to characterize a
[9037221.00s] room is put into it and impulse and then
[9040881.00s] record what the output is the output is
[9043551.00s] called the impulse response and then I'm
[9046971.00s] going to take that impulse response and
[9048591.00s] compute its DFT the DFT of that is
[9051471.00s] called the transfer function for a
[9053511.00s] reason I'm going to explain in just a
[9054921.00s] second so jump into chapter 10 the first
[9060320.00s] two sections just kind of make a quick
[9062601.00s] pass through that the section I want to
[9064431.00s] draw your attention to is the section
[9066320.00s] that's marked acoustic impulse response
[9394521.00s] okay so in the previous section we just
[9397490.00s] figured out that an impulse which is a
[9400880.00s] wave that is zero everywhere and one at
[9404000.00s] a particular very short period of time
[9405830.00s] is a signal that contains all the
[9409400.00s] frequencies at once so characterize a
[9411650.00s] room by putting any impulse into it well
[9414141.00s] how do you generate an impulse one way
[9417021.00s] to do it is to pop a balloon this is one
[9419210.00s] of things that people actually do when
[9420410.00s] they want to characterize a room but the
[9422391.00s] other is any very sudden loud noise is
[9425360.00s] at least an approximation of an impulse
[9428110.00s] handclaps and gunshots are the other and
[9431931.00s] actually gunshots are at least firing a
[9434450.00s] starter pistol is one of the ways that
[9437030.00s] people actually characterize rooms so
[9439311.00s] here's what I did I went back to
[9440960.00s] freesound.org which again is this great
[9443271.00s] resource and they have lots of
[9444980.00s] recordings of gunshots because this is
[9446870.00s] what acoustic engineers do and this is
[9450141.00s] what it sounds like if you fire a gun in
[9453580.00s] some particular room here's what it
[9456500.00s] sounds like
[9457931.00s] so that is the impulse response I'm
[9462230.00s] assuming that the gunshot itself was
[9464510.00s] like a mathematical impulse but what you
[9467090.00s] hear is not just a single sharp crack
[9470210.00s] but lots of delayed attenuated copies
[9475460.00s] you can think of this as being the sum
[9477410.00s] of the gunshot plus lots and lots of
[9480500.00s] echoes and you can kind of see that
[9484040.00s] visually when you look at the waveform
[9487010.00s] you can think of this as being a really
[9489681.00s] sharp peak at the shortest path between
[9493311.00s] the microphone and the gun and lots and
[9496221.00s] lots of little Peaks for all the other
[9497840.00s] paths between the microphone and the gun
[9500530.00s] now if we compute the spectrum of the
[9505641.00s] impulse response that's telling me if I
[9509330.00s] put all the frequencies in this is what
[9512271.00s] I get out so this is telling me that
[9515931.00s] this room will do will take low
[9519141.00s] frequencies and let them go through
[9520610.00s] mostly unchanged
[9522410.00s] it'll take high frequencies and cut them
[9524300.00s] off to varying degrees in the exact
[9526641.00s] shape of this curve
[9528140.00s] is telling me what the room does to
[9530449.00s] every frequency it's also telling me how
[9533810.00s] much of a delay the room imposes on all
[9536840.00s] the frequencies because that's encoded
[9539029.00s] in the phase information I'm not showing
[9541460.00s] it because graphically it doesn't mean
[9543050.00s] very much but this is a case where the
[9544760.00s] phase does matter if you're looking at
[9547250.00s] the transfer function we care about
[9548510.00s] phase because that's telling me how much
[9550699.00s] each frequency component is being
[9552380.00s] delayed by and now if you shuffle the
[9555260.00s] phases like we did with that other
[9556729.00s] example that will mess things up okay so
[9561319.00s] we're not going to do it but that's the
[9563060.00s] transfer function this is the transfer
[9565819.00s] function on a log-log scale which
[9567529.00s] sometimes makes the structure of it a
[9569569.00s] little bit easier to see now I'm gonna
[9573890.00s] take my violin recording again and I'm
[9576560.00s] going to play that just to remind you
[9578359.00s] what it sounds like and I can compute
[9583580.00s] the Fourier transform of the input so
[9587239.00s] this is the spectrum of the violin now
[9593569.00s] there are two ways to figure out how
[9595909.00s] this room is going to behave one way is
[9598760.00s] convolution in the time domain so I'm
[9601370.00s] gonna take oh sorry no this is plain old
[9603830.00s] multiplication I'm gonna I'm gonna do
[9606170.00s] this in the frequency domain so I'm
[9608420.00s] gonna take the spectrum which is the
[9610550.00s] spectrum of the input I'm going to take
[9612830.00s] the transfer function which is the
[9614870.00s] spectrum of the impulse response
[9619569.00s] multiply them together element-wise
[9622060.00s] that'll give me the spectrum of the
[9624319.00s] output and then the make wave operation
[9627350.00s] is the inverse DFT I'm gonna go over
[9632210.00s] this again in a second so don't panic
[9634210.00s] this is what the output looks like
[9638830.00s] there's the output and here's what it
[9641659.00s] sounds like two things you might notice
[9652010.00s] there one is there's a weird little loop
[9654380.00s] at the beginning that's being wrapped
[9657350.00s] around from the end that's one of those
[9659779.00s] boundary conditions that I mentioned
[9661430.00s] that's always
[9662069.00s] of a pain when you're doing stuff like
[9663419.00s] this there are ways to work around that
[9665459.00s] but I'm not going to get into that level
[9666930.00s] of detail right now but the other is you
[9672180.00s] can kind of get a sense of what that
[9674039.00s] violin sounds like when it's being
[9676439.00s] played in a different room you can
[9679229.00s] almost get a sense of what the room
[9680640.00s] looks like which is it sounds kind of
[9682949.00s] echoey and it sounds kind of big it
[9686909.00s] sounds like a big echoing room in fact
[9689789.00s] it kind of sounds like a firing range
[9691260.00s] which is I suspect where that gunshot
[9693959.00s] was recorded I don't know that for sure
[9695669.00s] but that's at least what it sounds like
[9698789.00s] to me so there are two ways to think
[9703680.00s] about what we just did and kind of two
[9706739.00s] sets of vocabulary that go together
[9708539.00s] I took a wave which is the violin so the
[9711989.00s] top left there is the violin and the
[9715140.00s] middle is the impulse response that's
[9718020.00s] what the gunshot sounded like that's
[9720089.00s] what the room reason that was the
[9721560.00s] response of the room to an impulse input
[9724010.00s] when you convolve the two of them
[9726180.00s] together you get the thing in the upper
[9728039.00s] right which is that nice echoey version
[9731039.00s] of the violin that we just heard so one
[9733919.00s] way to think about what we did is
[9735689.00s] convolution in the time domain the other
[9738749.00s] way to think about what we did was we
[9740729.00s] took the spectrum of the violin
[9742829.00s] recording and we applied a filter to it
[9745350.00s] that filter is the DFT of the impulse
[9749909.00s] response it is the system
[9753379.00s] characterization that tells me what
[9755939.00s] effect that room has on each frequency
[9758819.00s] both in terms of amplitude and phase and
[9761520.00s] the result is the spectrum of the output
[9765300.00s] the spectrum of the violin if it had
[9768119.00s] been played in the room where the
[9769739.00s] gunshot was recorded and just to
[9776489.00s] substitute in some vocabulary this is
[9779010.00s] when we were talking about the
[9779879.00s] convolution theorem we talked about a
[9781800.00s] window and it's corresponding filter in
[9784199.00s] the context of this system
[9786619.00s] characterization the window now is the
[9790140.00s] impulse response and its spectrum is the
[9793529.00s] transfer function the reason it's
[9796271.00s] a transfer function is that it tells you
[9798341.00s] how the system behaves it tells you how
[9800801.00s] the system transfers the input into the
[9803471.00s] output and this is the graphical
[9808061.00s] representation of what we just did
[9811561.00s] questions
[9819890.00s] we have one more section of the notebook
[9821449.00s] if you want to jump back in run the
[9823819.00s] convolution section and I think that's
[9826220.00s] the last section we're gonna do if the
[9827569.00s] notebook
[9847490.00s] when you run this cell it will take a
[9849750.00s] long time because it's a wildly
[9851189.00s] inefficient way to do things
[10065550.00s] [Music]
[10094050.00s] [Music]
[10124021.00s] okay let me talk through the example
[10126721.00s] that you're working through here so I
[10129030.00s] said before that an acoustic system a
[10132480.00s] room is producing lots of shifted scaled
[10135960.00s] copies of the input so again the sound
[10138721.00s] that's coming out of my mouth is getting
[10140250.00s] to you by many different paths and each
[10142950.00s] of those paths is shifting the input
[10145620.00s] which means that there's a delay between
[10147601.00s] my mouth and when it gets to your ears
[10149880.00s] and it's also scaling it which means
[10152760.00s] that it's getting louder or well not
[10155070.00s] louder it is being attenuated by
[10157351.00s] different degrees depending on which
[10159300.00s] path it took so I've got a function here
[10162000.00s] called shifted scaled that just takes an
[10164431.00s] input delays it by a certain amount of
[10167040.00s] time and scales it by a certain factor
[10170181.00s] just to show you how it works I did one
[10172740.00s] version that just takes the input which
[10175590.00s] is the gunshot and makes just two copies
[10181521.00s] one loud one and then one quiet one so
[10185490.00s] this is like firing a gun in a canyon
[10187880.00s] where you hear the initial shot directly
[10190980.00s] and then it bounces off the far end of
[10192811.00s] the canyon and it comes back to you and
[10194971.00s] sure enough this sounds like an echo
[10201229.00s] so you distinctly hear two successive
[10204600.00s] shots and that's an echo in some sense
[10208319.00s] is a weird phenomenon to us part of the
[10211979.00s] reason that it's fun to go to a canyon
[10214050.00s] and yell and hear the echo come back is
[10216750.00s] that that's not how we normally hear
[10219300.00s] sound normally if you hear shifted
[10223020.00s] scaled copies of the same thing your
[10225449.00s] brain combines them into one thing you
[10228989.00s] don't actually realize that this is
[10230640.00s] happening but it's true if you hear two
[10233699.00s] sounds in rapid succession your brain
[10237350.00s] steps in and says oh no that wasn't
[10240359.00s] really two sounds that was really one
[10242970.00s] sound at an echo and I don't want you to
[10245250.00s] get confused so I'm gonna make it seem
[10247680.00s] to you like that was just one sound your
[10250289.00s] brain is constantly deceiving you like
[10253229.00s] that so that was part one one way to see
[10256920.00s] that that's true is that if you hear
[10259800.00s] things like half a second apart you
[10261840.00s] clearly identify them as two different
[10263640.00s] sounds but if I play a gunshot 220 times
[10268199.00s] per second
[10269699.00s] you don't hear bang bang mmmm-mmm bang
[10272189.00s] you hear something that sounds like a
[10274289.00s] tone at 220 Hertz
[10279649.00s] that was a 220 guns salute played with a
[10285300.00s] spacing between guns of a few
[10287010.00s] milliseconds so now we can take the same
[10294420.00s] thing for an arbitrary input signal like
[10297840.00s] a sine wave and make lots and lots of
[10300840.00s] shifted scaled copies of the sine wave
[10310500.00s] and let me see I think I've actually got
[10312790.00s] myself a little confused about this
[10314170.00s] example what are we doing here so I'm
[10316840.00s] starting with a sawtooth and then I'm
[10321820.00s] taking my impulse response right taking
[10324700.00s] my impulse response I'm making lots and
[10326410.00s] lots of copies of the gunshot and I'm
[10329530.00s] using the sawtooth can to control for
[10332560.00s] each copy how big it is
[10334689.00s] so the previous version the copies were
[10337060.00s] all the same size
[10338200.00s] now the copies are going to follow the
[10340210.00s] contour of a sawtooth and this is what
[10343359.00s] the output looks like and this is what
[10345939.00s] it sounds like
[10348420.00s] [Music]
[10350040.00s] so that is a simulation of the sawtooth
[10354189.00s] if it was played in the room where the
[10357130.00s] gunshot was recorded and it sounds to me
[10361270.00s] a little bit like it's in a garage it
[10363340.00s] kind of sounds like a car horn being
[10366460.00s] played in an echo II garage and we can
[10371920.00s] see the spectrum before and after and
[10373660.00s] again it's behaving like a low-pass
[10375609.00s] filter as far as the amplitudes are
[10378100.00s] concerned but it's also got this phase
[10380320.00s] information that I'm not showing
[10381790.00s] graphically and that's where the echoes
[10383979.00s] come from the echoes come from the phase
[10387090.00s] so what I just did creating lots of
[10391120.00s] shifted scaled copies and adding them up
[10393280.00s] that's what convolution is
[10395260.00s] mathematically it is equivalent to say
[10398260.00s] I'm applying a filter in the frequency
[10401170.00s] domain or I'm making lots and lots of
[10403810.00s] shifted scaled copies in the time domain
[10406710.00s] mathematically that's what convolution
[10408880.00s] is and we can see that by applying the
[10411460.00s] convolution operator and getting pretty
[10414580.00s] much the same output doing the same
[10417729.00s] thing with the violin
[10420649.00s] we get what the violin would have
[10423439.00s] sounded like if it was played in the
[10425630.00s] room where the gunshot was recorded
[10430479.00s] making sense questions alright so we
[10437810.00s] just got two views of the same thing one
[10441200.00s] of them in the time domain convolution
[10443870.00s] is like adding up shifted scaled copies
[10446330.00s] of things and then our ears doing some
[10449810.00s] work to put that stuff together for us
[10451700.00s] so instead of sounding like many many
[10454160.00s] impulse responses it sounds like the
[10457850.00s] input played in the room where the
[10460220.00s] gunshot was fired because one way to
[10463970.00s] think about the input is that the input
[10466880.00s] is a sequence of impulses remember that
[10470750.00s] what a wave is is a bunch of samples at
[10473359.00s] discrete points in time you can think of
[10476180.00s] each of those samples as being an
[10477800.00s] impulse and each of those impulses is
[10481609.00s] being fired like a gunshot
[10483290.00s] one after another some of them are
[10485540.00s] louder than others and each of them is
[10487100.00s] delayed from its predecessor and then
[10489890.00s] the output is the sum of many shifted
[10493010.00s] scaled copies so I hope that that's one
[10497090.00s] helpful idea if you remember one thing
[10500359.00s] you should think every time you hear the
[10502729.00s] word convolution you should think I'm
[10505160.00s] adding up lots of shifted scaled copies
[10508100.00s] of the input if you think about
[10510859.00s] convolution that way it makes sense this
[10512750.00s] is the output that's what that violin
[10514280.00s] looks like and that is the third piece
[10517010.00s] of what we needed so we started out with
[10519200.00s] this example where I could simulate the
[10522050.00s] effect of a violin being played in a
[10524600.00s] room that I had characterized by using
[10527570.00s] an impulse running its impulse response
[10530510.00s] and the three pieces that we needed to
[10532760.00s] make sense of that were the discrete
[10535100.00s] Fourier transform which is how we get
[10537229.00s] back and forth between the time domain
[10538820.00s] and the frequency domain
[10540140.00s] we'll use the convolution theorem which
[10543140.00s] says that anything I do in the time
[10544880.00s] domain corresponds to an operation in
[10547580.00s] the frequency domain in other words I
[10549830.00s] can think of it as taking a signal
[10552979.00s] breaking it up in
[10554301.00s] - its frequency components applying an
[10556940.00s] operation to each of those frequency
[10558650.00s] components and then adding them up again
[10560871.00s] that's the convolution theorem and then
[10563301.00s] the third is linear time-invariant
[10564860.00s] theory that says that if I've got a room
[10567831.00s] or any other system as long as it obeys
[10570741.00s] the rules the LTI rules then all I need
[10574431.00s] to know is the impulse response and I
[10576951.00s] know everything I need to know about the
[10578451.00s] room all right we did a lot and we did
[10584211.00s] it really fast I hope it makes sense I
[10586971.00s] hope you're going to leave with a big
[10588621.00s] picture of what's going on I also hope
[10590961.00s] that you'll be interested in learning
[10592341.00s] more about it obviously I'm gonna
[10594561.00s] recommend one resource which is think
[10596181.00s] DSP you have basically gone through the
[10599721.00s] five out of the ten chapters of think
[10602991.00s] DSP so if you want the other five
[10604461.00s] chapters again you can grab a copy it's
[10607371.00s] sold by O'Reilly but also electronic
[10610190.00s] versions are free from green tea press
[10612951.00s] so check that out it's under a Creative
[10615291.00s] Commons license in part because I get a
[10618501.00s] lot of feedback from readers that helps
[10620150.00s] me improve the book sometimes finding
[10622371.00s] errors or sometimes just telling me this
[10624771.00s] is the point where I got confused can
[10627110.00s] you explain that better so if you do get
[10629421.00s] a chance to work through it let me know
[10630801.00s] what works for you let me know if there
[10633110.00s] are places that you think I can improve
[10636281.00s] lastly that is four ways to get in touch
[10639681.00s] with me so if you want to ask any
[10642951.00s] questions or follow-up and then the last
[10645261.00s] thing we have a survey that is your
[10647721.00s] chance to give us some feedback on the
[10650150.00s] tutorial and as you can see I was
[10652131.00s] supposed to add that link I think you
[10654110.00s] might get it by email but I think I can
[10657201.00s] also probably find it and I'll put it up
[10659150.00s] here in just a second but let me take a
[10661311.00s] couple of minutes to take questions if
[10663831.00s] you have any and then we will break up
[10666221.00s] anything you want to ask about yes sir
[10675290.00s] good right that's a great question the
[10682290.00s] question is does the impulse response
[10684229.00s] contain the initial bang plus other
[10687540.00s] things or is it just the other things
[10689550.00s] it's really just the other things the
[10692580.00s] bang itself is almost unobservable
[10695180.00s] unless it like even if you put a
[10697740.00s] microphone right next to the gun there's
[10700290.00s] still some distance there there's still
[10702450.00s] some air between the gun and the
[10705270.00s] microphone and that's still like a
[10707310.00s] system so the initial impulse is
[10712220.00s] unobservable you really only can ever
[10715530.00s] observe the output of a system never
[10718859.00s] really the input I didn't expect it to
[10722729.00s] get so philosophical but it kind of does
[10724410.00s] yeah
[10739030.00s] right
[10755501.00s] yes let me try to paraphrase that what
[10758021.00s] you said is you know anything in the
[10759881.00s] real world like a gun or a room or
[10762041.00s] anything like that we never have a pure
[10764230.00s] mathematical description of that thing
[10766451.00s] it's always you know real-world
[10768131.00s] messiness but but it sounds like you're
[10770860.00s] asking like could I engineer a room that
[10773081.00s] is as close as possible to recording a
[10775780.00s] real impulse like a perfect gun and a
[10778990.00s] room that has no Actos at all so it's
[10781271.00s] totally dead in fact if you if you look
[10783940.00s] on YouTube there's a video about a dead
[10786190.00s] room that somebody built exactly to do
[10789190.00s] these kinds of experiments and it's
[10791141.00s] basically a wire mesh cage completely
[10794681.00s] surrounded by styrofoam but like
[10797471.00s] acoustic foam that is intended to be
[10800110.00s] soft and dead and produce no echoes so
[10803201.00s] yes as an engineering exercise you can
[10806291.00s] get closer and closer to recording up
[10808541.00s] pure impulse but then you said something
[10811240.00s] interesting which is can you hear up
[10813461.00s] here impulse the ears the ears also a
[10817780.00s] system right
[10819011.00s] I mean what's what is actually happening
[10821051.00s] with a pure impulse is just that the air
[10822791.00s] pressure is suddenly changing from one
[10824951.00s] level of pressure to another and I don't
[10828341.00s] know if right
[10838261.00s] so the question is why would different
[10840251.00s] guns in the same room have a different
[10841751.00s] sound and yeah that's getting into some
[10843190.00s] of the mechanical vibration of the
[10844570.00s] actual gun and also the resonance of the
[10847061.00s] barrel and all that yep it would
[10859181.00s] probably be close the question is if you
[10861070.00s] if you do different things to try to
[10863351.00s] approximate an impulse so gun gunshots
[10866171.00s] and hand claps and balloon pops you're
[10868841.00s] gonna the impulse response will look
[10870700.00s] somewhat different but probably similar
[10873131.00s] enough that you wouldn't hear the
[10874900.00s] difference between those violin
[10877030.00s] simulations yes
[10893590.00s] would it be a quick square-wave yeah it
[10896540.00s] wouldn't be square coz square czar hard
[10898580.00s] to do in reality now you've got me
[10900830.00s] thinking I think that probably the best
[10902180.00s] approximation would be a giant speaker
[10904310.00s] cone that's driven by an extremely
[10908090.00s] strong linear inductor that would try to
[10911810.00s] just drive the cone as quickly as
[10913670.00s] possible out and back I think that's the
[10916490.00s] best mechanical system to produce the
[10918680.00s] closest thing to a sound impulse I don't
[10920750.00s] know I'm making this up okay good
[10953390.00s] question let me see if I can paraphrase
[10954560.00s] it so we've been talking about recording
[10957050.00s] an impulse response what we haven't
[10959210.00s] talked about is now taking that
[10960439.00s] recording and sampling it and you're
[10962660.00s] asking what effect the sampling rate
[10964220.00s] will have when you try to record the
[10966050.00s] impulse response the answer is yeah
[10968240.00s] you're gonna have to worry about the
[10969260.00s] cutoff frequency and aliasing which is
[10972080.00s] the sample rate will determine the
[10974330.00s] highest frequency that you can
[10975830.00s] characterize so if the room does
[10978920.00s] something different to higher
[10980149.00s] frequencies you won't know about it
[10981800.00s] after doing sampling and even worse than
[10985010.00s] that if the impulse response contains
[10988310.00s] many many high frequency components when
[10991760.00s] you sample they're going to get aliased
[10993530.00s] back into the range and they're going to
[10995810.00s] mess up your measurements so in practice
[10998540.00s] when people take a recording and then
[11001720.00s] sample it it's a really good idea to
[11004270.00s] apply a low-pass filter before sampling
[11007060.00s] so an analogue low-pass filter to make
[11010330.00s] sure that you get rid of any frequency
[11012100.00s] components that are above the cutoff of
[11013840.00s] your sampling so that at least they
[11017260.00s] don't get aliased it's not ideal that
[11019930.00s] they get dropped but dropped is better
[11022390.00s] than aliased yeah
[11040290.00s] yes good question so the question is do
[11043830.00s] I need the convolution theorem to do
[11045899.00s] this or could I I mean it's
[11049399.00s] computationally faster but could I do it
[11051840.00s] in the slow way and yes in fact the last
[11054300.00s] example that we looked at in the
[11055620.00s] notebook was doing it the slow way and
[11057770.00s] yes they are equivalent is just one of
[11060330.00s] them is faster than the other in some
[11062460.00s] ways if you like what's actually going
[11064050.00s] on in the room is the slow way physics
[11066779.00s] is doing it the hard way because it is
[11069120.00s] making shifted scaled copies anything
[11073979.00s] else yes correct no that's good you said
[11088830.00s] it again which is good yeah if you're
[11090240.00s] using a low-pass filter before sampling
[11092370.00s] it has to be an analogue low-pass filter
[11095120.00s] and you and you would tune it to
[11097200.00s] whatever you know the sampling rate is
[11099000.00s] going to be correct once you've done the
[11106350.00s] sampling the aliasing has already
[11108240.00s] happened and there's no way to undo it
[11110870.00s] good all right let me stop there thank
[11113189.00s] you all very much this has been great
[11115270.00s] [Applause]
