# YouTube Transcript

- URL: https://www.youtube.com/watch?v=WgJMjDh0nLU
- Video ID: WgJMjDh0nLU
- Segments: 427

## Transcript (>> Good day.)

[556.00s] >> Good day.
[946.00s] This is Jim Pytel from Columbia Gorge Community College.
[3576.00s] This is Digital Electronics.
[5156.00s] This lecture is entitled Digital Signal Processing Basics
[8576.00s] and the Nyquist Sampling Theorem.
[10076.00s] A tiny disclaimer before we begin here.
[12236.00s] This particular unit of the Digital Electronic Series is
[15086.00s] at most a brief outline of digital signal processing.
[18806.00s] Entire courses, entire textbooks
[21456.00s] and entire careers are made upon this technology
[24586.00s] and my feeble attempt at putting 45 total minutes of garbage
[28896.00s] on the internet is in no way meant to represent the summation
[32606.00s] of human knowledge about DSP.
[33976.00s] What I'm trying to do with this particular unit is present a
[36726.00s] basic overview of the whole DSP process and the various methods
[40116.00s] that are used to convert analog signals to digital
[42846.00s] and vice-versa, and digital signals back to analog.
[45336.00s] What I'm hoping to accomplish with this particular unit is
[48466.00s] for you to obtain at least a technician level understanding
[51646.00s] of DSP, being made aware of its role in modern industrial
[55736.00s] and communication systems.
[57036.00s] I'm skipping all the crazy math.
[58626.00s] I'm making broad sweeping generalizations, waving my hands
[62216.00s] at other things, and most definitely telling you
[64926.00s] to ignore the man behind the curtain about others.
[67416.00s] So let's begin with DSP, and how I like to begin these lectures,
[72016.00s] let's start this off with a common character
[73946.00s] that pretty much if you're breathing probably should be
[76446.00s] able to recognize.
[77456.00s] What I want you to start off
[78536.00s] with is just taking the upper right-hand corner
[80716.00s] of your notebook and draw Pacman.
[82706.00s] And most of you guys have probably drawn a character
[85606.00s] that is semicircular in nature with a little wedge out of it,
[89956.00s] sometimes he's got an eye.
[91056.00s] And the deal is that's not Pacman,
[92986.00s] that's your idealized representation of Pacman.
[96316.00s] Over here in my upper right-hand corner
[98216.00s] of the screen is the actual Pacman as displayed
[101636.00s] by your 1980s era Atari or whatever game system.
[105976.00s] Notice how he is pixelated and blocky.
[108346.00s] However, it's close enough to round,
[111086.00s] your brain perceives him as such.
[114336.00s] And that's the point of digital signal processing.
[116716.00s] It's to represent analog data as an approximated digital version
[121276.00s] or vice-versa to represent digital data
[123966.00s] as an approximate representation
[126006.00s] of an analog signal that is close enough.
[128246.00s] And the reason why we're doing this,
[130476.00s] there are certain advantages and they kind of go back
[133196.00s] to those beginning advantages I talked about digital
[136346.00s] in the first place, okay?
[137516.00s] So the advantages of converting some naturally occurring analog
[141286.00s] signal to digital form you could potentially remove unaudited
[144446.00s] noise, we could potentially increase or reduce the amplitude
[148236.00s] of certain signals, can encode that digital data
[151276.00s] for secure transmission.
[152496.00s] Say, for example, cell phone, you can detect
[154816.00s] and correct errors, you could perhaps store
[157616.00s] that digital data a little bit better and, like I said,
[160326.00s] you're going right back to the very most basic lecture
[164536.00s] that I talked about in digital electronics in the first place -
[166906.00s] why are we using digital in the first place,
[169266.00s] because of these basic advantages, it can be processed,
[172646.00s] stored, transmitted and reproduced more accurately
[176926.00s] and reliably and easily,
[179036.00s] that's the reason why we're taking this analog data
[181586.00s] and converting it to digital in the first place.
[183606.00s] There is a certain basic block diagram to understand DSP,
[187746.00s] which I've got written right here.
[189926.00s] I've got a certain analog signal coming in in the left
[194146.00s] and it's being put into an input filter.
[197086.00s] So, say for example, this is a naturally occurring analog
[200836.00s] signal that has a spurious high frequency noise you do not want.
[206646.00s] Say, for example, you would want to just go ahead and put
[209336.00s] in a low pass filter and get rid of that high frequency noise.
[213456.00s] So there's no sense including it in your dataset
[215836.00s] if it's something you don't want to begin with.
[217836.00s] So there's this input filter getting rid of something
[220376.00s] that you may not potentially want to include.
[222456.00s] This next block here is what's known
[224466.00s] as a sample and hold circuit.
[226606.00s] Okay, the sample and hold circuit is basically taking
[230446.00s] that smoothly varying analog signal,
[232706.00s] which I've represented right here on the left-hand side
[235596.00s] with this red and basically the sample and hold circuit
[238836.00s] at a certain frequency it is sampling, i.e.,
[242176.00s] looking at that analog data.
[244646.00s] And in between the times it samples, let's say it looks
[247986.00s] at the data right there, right there, right there, right there,
[251166.00s] so on and so forth, basically it is sampling at that point
[254476.00s] and it is holding it at that value
[257056.00s] until the next sample occurs
[259156.00s] because I know these things are smoothly changing
[261776.00s] over the period of time, however,
[263526.00s] there is a certain frequency at which we are sampling, okay?
[266596.00s] So it's sampling that data,
[268026.00s] holding it at the value it was sampled
[270136.00s] at until the next sample occurs, at which point it goes
[273086.00s] on to this thing called an ADC, this is really kind of the heart
[277216.00s] or the first steps of digital signal processing.
[280316.00s] Okay, what is an ADC?
[282526.00s] It's an analog to digital converter, so ADC,
[286966.00s] analog to digital converter.
[288566.00s] And it's using that sampled positions,
[291946.00s] and what it's doing it's quantizing it.
[294186.00s] So what does quantization mean?
[296116.00s] Basically, it's assigning binary value to those analog inputs.
[301146.00s] So, again, quantization is basically assigning a binary
[303936.00s] value to those analog examples.
[305716.00s] And what I've drawn here
[306936.00s] on the right-hand side is a quantized representation
[311766.00s] of that same analog signal,
[313846.00s] so where we have given these are supposed
[316146.00s] to represent binary values, okay?
[318836.00s] These are supposed to represent binary values here.
[321416.00s] in our particular case what we've got is the [inaudible]
[323546.00s] quantization of that analog wave form,
[325966.00s] let's say for example this is a digital multi-meter, you know,
[330716.00s] it's sampling voltage levels smoothly varying
[334056.00s] at certain period of time and it's assigning a binary value
[337876.00s] to each one of those, at which point this binary data is now
[342026.00s] being fed into this DSP.
[344116.00s] What is the DSP, it's the digital signal processor,
[347446.00s] very similar to a microprocessor except it's handling some pretty
[350726.00s] advanced math at an incredibly, incredibly fast rate.
[354476.00s] When you think about a varying voltage signal,
[356946.00s] every 16.67 milliseconds it's gone through its entire sequence
[362686.00s] from high positive, back to zero,
[365316.00s] to low negative, back to zero.
[367676.00s] You've got to sample that at an incredibly fast rate.
[370626.00s] Think about speech, think about music,
[372736.00s] all these things are occurring in real time,
[374526.00s] that digital signal processor is having to keep up with that.
[377036.00s] And what is that digital signal processor doing?
[379256.00s] Well, it's processing and it's storing it, transmitting and,
[382776.00s] or reproducing that analog data, and removing,
[387086.00s] basically all those advantages,
[388606.00s] that's what the digital signal processor is doing.
[390806.00s] It's going ahead and changing that binary representation
[394886.00s] of the analog data to a better form
[397196.00s] that might be used a little bit later.
[398546.00s] What is the next block in this diagram here?
[401186.00s] What's the DAC, D-A-C?
[403706.00s] If ADC stands for analog to digital converter,
[407266.00s] what does DAD stand for?
[409006.00s] Obviously, it stands for digital to analog converter,
[412226.00s] digital to analog converter, and that's basically what your iPod
[416206.00s] or your iPhone is doing to that digital representation
[419906.00s] of music that's stored on it,
[421616.00s] it's taking the digital representation,
[423826.00s] it's making an analog wave form, which is being sent
[427296.00s] to the speakers, however, there might be an output filter
[430566.00s] because notice the stair step-like approximation,
[433406.00s] our digital data looks like there?
[435206.00s] Perhaps we want to go ahead and smooth that output
[437506.00s] so smoothly varying analog output
[440406.00s] which could perhaps represent music or speech
[442846.00s] or some other quantity.
[444396.00s] So this very basic block diagram is going to be used over
[448826.00s] and over when we discuss DSP.
[450856.00s] We are going to go into in-depth ADC and the DAC and some
[456136.00s] of the methods used to go ahead to do that,
[458806.00s] but your understanding of this basic step-by-step block diagram
[463176.00s] is pretty essential to your understanding of DSP.
[466046.00s] So I've only briefly mentioned this concept of sampling
[469976.00s] and frequencies, and I've also told you that, okay,
[473746.00s] I'm going to go ahead and forego the crazy math.
[476576.00s] All right, we do have to actually discuss some
[479006.00s] of the crazy math and how we're going to do this is actually
[481556.00s] in a pretty easy method to discuss the sampling here.
[485326.00s] So we're going to go ahead
[485976.00s] and discuss some pretty crazy complicated math in the form
[489116.00s] of what's called the Nyquist Sampling Theorem.
[492196.00s] We're going to have Lassie,
[493836.00s] the world's most famous dog, present it to you.
[495926.00s] So to set up a joke here what we've got is Lassie laying
[499316.00s] by the road asleep, and Farmer Brown revs
[502166.00s] up his big old pickup truck and takes off for work
[505616.00s] and as he makes the turn going into town he looks at Lassie
[509076.00s] and sees that she's asleep.
[510256.00s] As soon the dust from Farmer's Brown pickup truck disappears
[513506.00s] over the hill, Timmy falls in a well.
[515206.00s] So what does Lassie do?
[516196.00s] Lassie responds to his cries, cries for help.
[518446.00s] Goes ahead, saves him, pulls him out of the well,
[520826.00s] gets him back inside the house.
[522246.00s] She lays back down and tries to get a nap.
[524476.00s] Two seconds go by, Timmy is in the medicine cabinet,
[527266.00s] he's ingested a bunch of codeine.
[528946.00s] So Lassie has got to run inside, go ahead and get the codeine
[532776.00s] out of Timmy and perhaps administer first aid, CPR,
[536856.00s] perhaps even using an AED, and now Timmy is doing fine.
[540016.00s] She puts him on the couch.
[540986.00s] She goes back out, lays down and tries to take a nap.
[543526.00s] Pretty soon Timmy gets into the gun cabinet
[545926.00s] and he is shooting wildly in all different directions.
[548736.00s] Lassie goes ahead, calls the SWAT Team,
[551056.00s] gets the SWAT Team in there.
[552116.00s] They subdue Timmy and then, finally,
[554736.00s] Timmy is a little bit tired from today's activity, falls asleep.
[557616.00s] And then Lassie goes back out to the driveway
[559616.00s] and falls asleep again, at which point Farmer Brown comes back
[562786.00s] from work.
[563466.00s] And as he's making a turn
[564566.00s] into the driveway he sees Lassie asleep by the driveway.
[567906.00s] He look at her and he says, lazy dog.
[569946.00s] The point of that joke is Farmer Brown did not sample Lassie
[574936.00s] at the correct frequency.
[576506.00s] He only looked at her two times during that day,
[579636.00s] and she happened to be in the same position.
[582576.00s] So what this Nyquist Sampling Theorem states is you've got
[586346.00s] to go ahead and sample something at least twice the frequency
[590746.00s] at which it is naturally occurring.
[592676.00s] And had Farmer Brown been there more
[595036.00s] than two times during the day he would have realized
[598556.00s] that Lassie had a pretty incredibly difficult day.
[601166.00s] And that's point of the Nyquist Sampling Theorem, you're going
[603526.00s] to go ahead and have to sample a naturally occurring analog piece
[607906.00s] of data at twice the frequency that you wish to capture
[611686.00s] to go ahead and reliably reproduce that data.
[614486.00s] A simple illustration
[615696.00s] of the Nyquist Sampling Theorem gone terribly wrong,
[618306.00s] let's use the Farmer Brown method.
[620116.00s] Here what we've got is an analog signal of a certain frequency.
[624066.00s] Let's say it is a United States distribution wave,
[628236.00s] so it's 60 hertz, and let's sample it at 60 hertz, okay?
[633666.00s] And let's say our first sample occurs here,
[636276.00s] the next sample occurs here, here, here.
[639626.00s] And because we are inappropriately sampling this
[643236.00s] at an inappropriate frequency very clear, you're like, oh,
[646796.00s] it's obviously 170 volts DC signal.
[650866.00s] Do you get the point here?
[651876.00s] It is not a DC signal at 170 volts constantly
[657256.00s] because it is taking a value from zero to positive 170,
[661336.00s] back to zero, down to negative 170
[663926.00s] with an RMS value of 120 volts.
[666726.00s] So that is a misapplication of the Nyquist Sampling Theorem,
[670646.00s] very clearly demonstrating that it is being aliased,
[674456.00s] you know, think about an alias?
[675806.00s] It is a disguise, okay, it is not a DC so you know, in fact,
[680746.00s] it's an AC signal and this misapplication,
[684256.00s] this Farmer Brown method of just looking at it not
[687296.00s] with the correct frequency you're going
[689206.00s] to get all sorts of bad value.
[691346.00s] So just say, for example, our first sample is right there,
[694756.00s] let's do that one in blue, our first sample is right there,
[697126.00s] right there, right there.
[698296.00s] If you're occurring at that 60 hertz frequency you're going
[701586.00s] to say, okay, it is obviously a certain DC value
[705676.00s] and it's not, okay?
[706976.00s] So you're incorrectly sampling this thing.
[709256.00s] The Nyquist Sampling Theorem is we're going to have
[712846.00s] to sample this way and in this particular example it's 60
[716466.00s] hertz, we're going to have to sample it at 120 hertz
[720516.00s] to accurately represent this wave.
[722806.00s] So the naturally occurring period
[725196.00s] of this is right there for a single cycle.
[728346.00s] So let's say we sample there and there,
[730686.00s] what we're getting is a positive maximum and a negative maximum.
[734476.00s] It is not exactly the prettiest rendition of a wave,
[740506.00s] but if we know that we are sampling a sign wave to begin
[744256.00s] with we can accurately recreate that sign wave knowing
[748016.00s] that it peaks out at a certain value and it bellies
[750436.00s] out at another negative value.
[751926.00s] There are advantages perhaps of sampling
[755316.00s] at an increased frequency
[757006.00s] because you could potentially gain better representation
[759836.00s] of it, but we're not necessarily always sampling just a pure
[764446.00s] sign wave.
[765126.00s] And this is where the crazy, crazy, crazy math comes in.
[769276.00s] And I do want to illustrate a little bit about some
[771836.00s] of this crazy math here, and I'm going to start off
[774106.00s] with this basic statement, which may surprise you.
[777146.00s] Everything is sign waves.
[779826.00s] Every piece of information that can be -
[783626.00s] any signal is a summation of sign waves,
[786626.00s] including digital pulses, okay?
[789466.00s] And this is crazy and even to the point of reality, you know,
[793146.00s] because one of the most famous quotes
[795216.00s] from Nichola Tessla [Assumed Spelling] is if you want
[797336.00s] to find the secrets of the universe think in terms
[799946.00s] of energy frequency and vibration, reality,
[803506.00s] as we get down to it we are finding that as we get smaller
[807246.00s] and smaller we're realizing nothing is there,
[810096.00s] but vibrations and frequency, okay?
[812636.00s] So that is crazy, crazy math.
[814566.00s] What I want to talk to you here is just how you can possibly
[817626.00s] create some nations of sign wave.
[820286.00s] And one of the simplest ways
[821726.00s] to do this is take your TI89 graphing calculator
[825126.00s] and add sign waves up of different frequencies,
[828546.00s] what you get is wave forms that are different analog values,
[834466.00s] but they are composed of sign waves.
[836736.00s] And one of the ways I want
[838126.00s] to do this is a pretty crazy example, is a digital pulse.
[841226.00s] How can I represent a digital pulse
[843486.00s] as a summation of sign waves?
[845416.00s] Well, let me go ahead and just draw some diagrams here.
[847426.00s] So look at this digital pulse here, it's not a sign wave.
[850996.00s] How can I use sign waves of different frequencies
[853996.00s] to go ahead and represent this digital pulse?
[856336.00s] Well, first off, what I'm going to have to do is just think
[859156.00s] about a sign wave, it's zero centered.
[861476.00s] This is not zero centered.
[862876.00s] I'm going to have to raise it up by a certain amount.
[865766.00s] Okay, so there's a DC component in this,
[867926.00s] so this idealized representation of this digital -
[870806.00s] assuming these summated sign waves representation
[874176.00s] of this digital pulse, there is a DC component plus some sign
[878356.00s] waves, and those sign waves have a magnitude, a certain value
[882896.00s] and the amplitude and frequency.
[885106.00s] The more sign waves you put
[886816.00s] into this the more you can accurately represent any data,
[890406.00s] so I've chosen the digital pulse.
[891906.00s] This is one of the hardest things for you to do,
[894396.00s] to realize that, okay,
[895796.00s] sign waves can be used to create anything.
[898386.00s] If we have got a bias, we've got a DC bias here, let's just say
[901856.00s] if I took a sign wave of the fundamental frequency,
[905566.00s] let's say again it's 60 hertz,
[908026.00s] that kind of looks like a digital pulse.
[910336.00s] It's not, but it's a little bit closer.
[913506.00s] And that is a certain amplitude, which I'm going to call one,
[917476.00s] one sign of the fundamental frequency.
[920176.00s] What if I added to that?
[921596.00s] So I've got my DC component, I've got amplitude one
[924756.00s] of the fundamental frequency,
[926346.00s] what if I added the following - one-third of sign 3F?
[931176.00s] What is one-third sign 3F, three times the fundamental frequency,
[936446.00s] but a third of the value.
[937616.00s] Well, think about it, if this is the full period
[941256.00s] with the amplitude of one, what is one-third of that?
[944266.00s] Well, it's obviously going to be maxing out and minimizing
[946786.00s] out one-third of it, but it's going
[948546.00s] to go three full cycles in that same period.
[951716.00s] And when you add one-third sign three times the frequency
[955886.00s] to one sign, one frequency, believe it
[958436.00s] or not what you're getting is kind of something like this.
[962656.00s] Does that look a little bit more pulse-like to you?
[964866.00s] And I know I'm messing it up, like I said, waving my hands
[967506.00s] at certain things here.
[968256.00s] And now continue to add components, one-fifth sign
[972856.00s] of five frequency, that summation of that DC component
[976666.00s] of fundamental frequency, three times the frequency,
[979386.00s] five times the frequency,
[980726.00s] what you're getting is a little bit closer to that pulse.
[984366.00s] Add seven times, you're still going to get a little bit
[987236.00s] of an overshoot and ringing there.
[989186.00s] You're going to get closer and closer.
[990256.00s] This is the point, what I'm trying
[991546.00s] to say is everything is sign waves and now when I say
[996156.00s] that the Nyquist Sampling Theorem you have
[998216.00s] to do two times the highest frequency
[1001406.00s] which you wish to capture.
[1003116.00s] How accurately do you wish to capture this digital pulse data?
[1006926.00s] Because this thing goes on forever,
[1009326.00s] and this is what I'm saying
[1010416.00s] about there's some crazy math here.
[1012316.00s] Don't worry about the crazy math,
[1013676.00s] but realize that everything is a summation of sign waves.
[1017376.00s] I would have to go on forever to accurately
[1021956.00s] and truly represent clear digital pulse.
[1025266.00s] However, can I go twice the frequency forever?
[1028996.00s] No, the answer is no, you can't.
[1030556.00s] There's a practical limitation to these.
[1032556.00s] So you're going to get an idealized representation.
[1036006.00s] Your Pacman can never be the truly analog version of Pacman,
[1040526.00s] but it can get pretty darn close.
[1042946.00s] Now I've done an incredibly complicated example,
[1046216.00s] you should realize
[1046986.00s] that everything can be presented as sign waves.
[1050846.00s] Think about the audible range for human speech,
[1053886.00s] there's a certain frequency low
[1056006.00s] and a frequency high that can occur.
[1058396.00s] Why would you ever sample something out of that range
[1062566.00s] if it's not going to be heard to begin with?
[1064446.00s] We've got this range right here, and do not quote these things,
[1067886.00s] these things I'm just doing these off the top
[1069726.00s] of my heard here.
[1070246.00s] If I remember right like the human hearing response is
[1074356.00s] around 20 hertz if I remember right, maybe even lower,
[1077106.00s] six or eight hertz, up to 20 kilohertz,
[1081276.00s] that's hearing response range.
[1083256.00s] And this 20 kilohertz maximum here is really kind
[1086686.00s] of representative of your age.
[1088596.00s] Those individuals of younger ages, I do this experiment
[1093046.00s] in my Electronics I class, I get something going at 22 kilohertz
[1098356.00s] and I slowly drop it down and I see
[1101386.00s] which people turn their heads to hear the noise first
[1104716.00s] and it's always the younger students that do so, okay?
[1107526.00s] And then pretty soon I'm lowering it down,
[1109096.00s] lowering it down, lowering it down, finally some
[1110806.00s] of the older students say, hey, I can finally hear that, okay?
[1113586.00s] So that upper range might be around 21, 22 kilohertz.
[1117186.00s] Most people 16 kilohertz you're going to hear that.
[1120566.00s] So the point is the human hearing range goes from that 20
[1123666.00s] to 20 kilohertz for our purposes of this example, however,
[1126596.00s] human speech kind of tops out at 10 kilohertz.
[1129816.00s] So if you are potentially just talking,
[1133456.00s] you're not playing a musical instrument,
[1134946.00s] you're not doing anything like that, you know,
[1136736.00s] what is the minimum frequency which you'd be sampling,
[1140906.00s] which you should be sampling human speech at?
[1142986.00s] The answer is twice its maximum, so it's 20 kilohertz.
[1146806.00s] So if I'm going to do a very, very accurate representation of,
[1150786.00s] well, reasonably accurate representation
[1152956.00s] of human speech I want to sample it at 20 kilohertz.
[1156026.00s] That wave form, that it's obviously not a pulsed wave
[1159786.00s] form, but it is a wave form of human speech.
[1164406.00s] And like I said previously is I know that's not a pure sign
[1167986.00s] wave, but it can be represented as a summation of sign waves.
[1172246.00s] The highest frequency of which is
[1174716.00s] around 10 kilohertz for human speech.
[1176886.00s] I don't mean to delve into the crazy esoteric math too much
[1181776.00s] here, but it is important for you
[1183206.00s] to understand pretty much everything can be composed
[1185176.00s] of sign waves and for you
[1187076.00s] to accurately represent it there is a certain frequency
[1190016.00s] which you want to and you're going to go ahead
[1193036.00s] and somehow neglect certain amounts of data,
[1195836.00s] which may not be necessary
[1197866.00s] for your accurate representation later on.
[1200126.00s] This concludes the lecture of Digital Signal Processing Basics
[1203036.00s] and Nyquist Sampling Theorem.
[1204716.00s] We're to go into converting analog signals to digital,
[1208926.00s] basically, the analog to digital converter.
