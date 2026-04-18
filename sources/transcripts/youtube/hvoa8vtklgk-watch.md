# YouTube Transcript

- URL: https://www.youtube.com/watch?v=hVOA8VtKLgk&list=PLuh62Q4Sv7BUSzx5Jr8Wrxxn-U10qG1et
- Video ID: hVOA8VtKLgk
- Segments: 1326

## Transcript (what okay so what I want to do is review)

[599.00s] what okay so what I want to do is review
[4319.00s] kind of you know what is the big picture
[6759.00s] so in some sense this course Digital
[8320.00s] Signal processing is kind of like a
[9800.00s] discret Time version of signals and
[11040.00s] systems and so you know we have to
[13920.00s] understand kind of the key ideas right
[15440.00s] so we have
[19080.00s] signals which are basically you know the
[21320.00s] way I think about signals is they come
[22840.00s] from you know some sort of a sensor or
[24840.00s] some sort of a program so they come
[28359.00s] from sensors
[31679.00s] things like thermometers and voltmeters
[34120.00s] and microphones and cameras and stuff
[36079.00s] like that um and then
[41640.00s] systems process
[44960.00s] signals to produce other
[54039.00s] signals okay so for example you know you
[57480.00s] have a signal that comes from your
[60760.00s] gas pedal in your
[62199.00s] car that goes through some sort of a
[65560.00s] complicated you know system which we're
[67560.00s] going to call car and then the system
[69759.00s] the signal comes out is basically the
[72400.00s] velocity that drives your wheels right
[75000.00s] and so you know this is a probably
[77920.00s] horribly oversimplified and horribly
[79680.00s] complicated system under the hood but
[81840.00s] that's the idea or you know maybe I have
[84320.00s] a you know I have a CD that encodes a
[87119.00s] digital signal I put that into my stereo
[91280.00s] which maybe you guys don't even use
[92399.00s] anymore and what comes out of my
[94320.00s] speakers is sound right and so it's not
[96040.00s] like it's a onetoone mapping between
[98439.00s] bits of information on a CD and you know
[101280.00s] sound that comes out of my think for one
[102439.00s] thing this is a digital signal and this
[104200.00s] is a continuous signal right I'm driving
[106000.00s] a audio you know speaker that needs a
[108079.00s] continuous input and so historically all
[111000.00s] this kind of signals and systems stuff
[112360.00s] was driven by what I would call kind of
[114520.00s] like Power Engineering right you know in
[116600.00s] the early days if you look at the
[117799.00s] syllabus or uh or the the you know plan
[120439.00s] study for an electrical engineering
[121960.00s] student it was all about you know Motors
[123799.00s] and circuits and stuff like that now a
[125320.00s] lot of the curriculum is all about
[126840.00s] passing information back and forth and
[128319.00s] the same thing holds true for this and
[130520.00s] this kind of formalism is so successful
[132239.00s] that it's also applied to lots of other
[133959.00s] fields like chemical process control and
[136519.00s] economic modeling and stuff like that
[138280.00s] you can often boil all that stuff down
[139800.00s] into signals and system so even if you
[141360.00s] go go off and become a Quant on Wall
[143360.00s] Street you're still going to be
[144160.00s] interested in understanding things like
[145280.00s] foryear transforms and stuff like that
[148120.00s] so
[151599.00s] okay so the key distinction in our class
[155120.00s] is going to be continuous time versus
[157280.00s] discreet time right and so we already
[159879.00s] know from signals and systems that
[163080.00s] continuous time signals basically look
[166120.00s] like a plot like this where I have a
[167840.00s] function of T I have a signal like X of
[170879.00s] T and then that is basically some kind
[174599.00s] of unbroken line that represents a
[177400.00s] signal that I can ask at any point in
[179680.00s] time time you know time equals
[181920.00s] 0589 what is the value of the signal
[184840.00s] right on the other hand in this class
[187680.00s] we're really motivated by discret time
[193280.00s] signals and so in that case we have a
[195440.00s] function like X of
[197799.00s] N and X of n we're only going
[202440.00s] to allow that to be sampled at certain
[207200.00s] fixed discret intervals right so that
[210000.00s] means that I don't have anything that
[213319.00s] occurs between the gaps of these stem
[217599.00s] plots and so basically whenever I draw a
[219439.00s] digital signal it's usually going to be
[220879.00s] like this where I have little stem plots
[223319.00s] that represent what is happening at
[224760.00s] every point in time there is no such
[226959.00s] thing as X of 1.5 for a digital signal
[231720.00s] right you get only what's there and so
[234879.00s] um as you know there's a lot of you know
[237319.00s] theory behind how do I go from a kind of
[239879.00s] continuous signal to a discrete signal
[241760.00s] in such a way that I don't lose
[242879.00s] information that's what the sampling
[244120.00s] theorem is all about we're going to
[245400.00s] cover that in this class too um you know
[248040.00s] and and we know that in certain
[249840.00s] conditions you can actually sample
[251319.00s] continuous time signals so the samples
[253599.00s] are good enough to reconstruct the
[254879.00s] original continuous time signle if you
[256160.00s] wanted to so in some sense you haven't
[257560.00s] lost any information right so we're
[259680.00s] going to come back to that for
[261400.00s] sure okay
[264120.00s] so our focus is on this especially in
[266960.00s] this class because all computers these
[268919.00s] days are digital and so that means that
[271120.00s] even if these are the kinds of inputs
[273039.00s] that are coming into the system they
[274479.00s] still need to be converged something
[275600.00s] digital first and then they are
[276800.00s] digitally processed to produce some
[278120.00s] other digital system and then maybe
[279880.00s] there's a DDA converter at the other end
[281440.00s] that converts it back into a continuous
[283520.00s] time signal if it's needed okay but
[285440.00s] these days almost all of the processing
[287960.00s] inside the computer is digital right um
[291320.00s] so one thing that we didn't talk about a
[293000.00s] whole lot
[294080.00s] in like a continuous time signal class
[296440.00s] but that we will talk about in this
[297600.00s] class a little B more is not only are
[300240.00s] the samples taken at these discret
[302919.00s] spacings apart but also in practice I
[305800.00s] don't have like infinite resolution on
[307479.00s] the y- axis either right so for example
[309680.00s] you know here I may only have some
[313800.00s] discreet locations where my sticks have
[317479.00s] to fall exactly on one of these things
[320759.00s] that's called quantization right and so
[323000.00s] if you're used to listening if you look
[324600.00s] in your you know iTunes dropdown menu
[326880.00s] about you know quantization you can see
[328680.00s] I've got 8 per symbol or 12 bits per
[331160.00s] symbol right that kind of means you know
[332720.00s] how finally do I discretize the y- axis
[334800.00s] we'll talk about some of the
[335639.00s] implications of how that works also um
[341919.00s] okay
[344000.00s] so let's talk a little bit about um
[346919.00s] processing signals right so what are the
[349240.00s] kinds of basic operations that we can do
[351479.00s] to a
[352479.00s] signal
[354800.00s] so one of the most common ones is
[358240.00s] flipping
[361520.00s] and so especially if you've done
[363479.00s] convolution before you remember there's
[364600.00s] a lot of flipping involved right so if I
[366479.00s] have uh some X of
[370080.00s] n like
[382240.00s] this and I want to look at what is X of
[385520.00s] minus n all that means is I'm flipping
[387960.00s] the samples around the Y
[391000.00s] AIS so this guy at zero stays the same
[394479.00s] and then I kind of mirror it across
[397639.00s] the y
[401680.00s] AIS
[405520.00s] okay um there's
[412240.00s] scaling and so if I have let's use the
[416160.00s] same X of n let's talk about what is X
[419240.00s] of
[420400.00s] 2 okay so the way I think about this
[424919.00s] intuition is that this is kind of like
[426800.00s] saying you know I'm if I imagine this is
[428800.00s] an audio signal it's like saying I'm
[430039.00s] playing the signal twice as fast right
[431919.00s] that means that the overall duration of
[433919.00s] the signal should decrease by two and so
[437360.00s] that means what I'm doing here is I'm
[439039.00s] taking every other sample right so what
[442599.00s] that becomes is something like this
[450360.00s] so I'm going to label these samples
[458080.00s] here and so you know one thing that is
[461319.00s] definitely true in uh DSP that was not
[464520.00s] true in continuous time processing is
[466319.00s] that we lose information right so after
[468560.00s] I do this scaling I've thrown away those
[471759.00s] samples in between the ones that I had
[473919.00s] and I can never get them back right the
[476080.00s] only conceivable way I can get them back
[477639.00s] is if that I sample below the nyos or
[479840.00s] above the N straight and I can
[481159.00s] reconstruct continuous time signal and
[482560.00s] resample right so we're going to talk
[483599.00s] about that if you don't understand that
[484960.00s] don't worry about it so we're going to
[486720.00s] talk about that later but in in
[487960.00s] principle right for a continuous time
[490240.00s] signal I can squish it and stretch it
[491840.00s] I'm not really losing anything right but
[493680.00s] for a digital signal I'm definitely
[495080.00s] throwing away stuff right and so um
[499120.00s] that's one kind of special case and so
[501840.00s] let me just say that uh you know samples
[504240.00s] are lost
[512000.00s] another kind of let me just say what
[513519.00s] would what we do with something like
[514760.00s] this you know X of say n over3 that's
[518560.00s] kind of weird but you know it's worth
[519919.00s] kind of talking about for a second so
[522719.00s] what that would mean is that I am kind
[524320.00s] of slowing down the signal by a factor
[526519.00s] of three which means that it should get
[528080.00s] broader right and so in that case what
[530720.00s] that would be for this signal is well
[531839.00s] I've got this point this is what
[532959.00s] happened at zero what used to be one
[535880.00s] will now become
[538240.00s] three and and then what used to be two
[540399.00s] will now become six and so you know if I
[543320.00s] don't do anything else my expanded
[545640.00s] signal looks like this I don't have
[547839.00s] anything else to put in these middle
[550160.00s] locations because I don't have any
[552560.00s] samples to grab from right we're going
[554800.00s] to talk about that after the first exam
[556800.00s] but well okay well really I don't want
[558480.00s] this kind of what I want is something
[559959.00s] that kind of smoothly interpolates
[562040.00s] between the samples that I'm missing
[563279.00s] right again we can use a sampling
[565240.00s] theorem to solve that kind of
[567519.00s] problem okay
[570680.00s] any questions so
[573480.00s] far and the other thing is Shifting
[576040.00s] right so Shifting the signals is
[577760.00s] probably one of the most common things
[578800.00s] you want to do so what about
[589279.00s] shifting so here again I have to
[591640.00s] remember that in this case I've always
[593959.00s] got integers right so I mean if I'm
[596000.00s] shifting a signal by some amount it has
[598079.00s] to be by an integral amount
[599880.00s] and so if I have for
[601480.00s] example this is
[606760.00s] my I can do the same thing right in a
[609760.00s] ger if you like
[613399.00s] sure so if this is my you know signal
[616959.00s] here and I ask about you know shifting
[620760.00s] it by one unit what I get is something
[624519.00s] like this
[635240.00s] and I always did find this I mean
[636720.00s] sometimes people find this a little bit
[637720.00s] counterintuitive right this is like
[639040.00s] saying that if I have X at n minus one
[641279.00s] people think oh well shouldn't that mean
[642519.00s] that the signal shifts to the left
[644040.00s] because it's a negative number the way I
[645519.00s] think about this is that this number
[647120.00s] here tells me how how am I delaying the
[649600.00s] signal right so this is like saying the
[650839.00s] signal should start one unit later okay
[654079.00s] and you can always confirm this kind of
[655639.00s] thing by plugging in right so if I want
[657959.00s] to know what is
[660120.00s] is you know this is my transform signal
[663200.00s] this is my original signal so I can say
[665240.00s] okay well that means that y of two
[668399.00s] should be X of one right and I compare
[671440.00s] that to this I see yes y of two is X of
[673600.00s] one so if you're ever not really sure
[676200.00s] whether you're Shifting the signal the
[677519.00s] right way then you can just plug in some
[679160.00s] numbers to make sure that the things
[680480.00s] line up the way that they should
[683000.00s] okay so we can combine all this stuff
[686079.00s] together right so how would we handle
[689000.00s] something that is a little bit more
[690680.00s] complicated like
[694200.00s] this x of 2N - 2N + 3 okay so let me
[699760.00s] draw a little example signal so let's
[702839.00s] say this is
[706279.00s] our example
[714000.00s] signal okay
[716320.00s] well you have to do these steps in a
[718720.00s] certain order otherwise you'll get the
[720440.00s] wrong answer okay and so the always the
[723079.00s] always yeah the order that you should
[725040.00s] always do it is
[727920.00s] shift
[729959.00s] flip
[732760.00s] scale okay and what I mean by that is
[735720.00s] that I find it you never get the wrong
[737720.00s] answer if you do these operations very
[741639.00s] mechanically right so what I would say
[743560.00s] is first I'm going to define a new
[745279.00s] signal that
[747760.00s] is X
[750120.00s] n + 3 right that's just the shifting
[754600.00s] part then I'm going to Define another
[758279.00s] signal that is the previous signal that
[760680.00s] I got flipped that's the negative
[764480.00s] part then I'm going to finally get my
[768320.00s] result
[770720.00s] by scaling it by two and that's the
[774480.00s] scale part and again if I follow through
[777320.00s] my math I can see why this works right
[778880.00s] so this is what I ultimately want right
[781959.00s] and so I can say okay I'm saying that's
[784040.00s] W of 2N I plug 2N into here and I get Z
[788040.00s] of -
[789800.00s] 2N then I say what was z z was X of n +
[794399.00s] 3 so I plug in - 2N here and I get X of
[798720.00s] - 2N +
[800800.00s] 3 so you can see that it works out right
[803880.00s] and so now I can actually kind of carry
[805560.00s] out these operations right so X of n+ 3
[809519.00s] what that means is that I'm kind of
[811320.00s] delaying things by -3 units right that's
[814279.00s] like saying that the signal should start
[816040.00s] three units earlier so if these are my
[820240.00s] time markings on the original signal my
[822639.00s] Z
[823560.00s] signal is going to start three units
[826360.00s] earlier which means what used to be two
[828320.00s] will become minus one I should have left
[830920.00s] myself more room on the
[833519.00s] page right so this is my zen
[839160.00s] this goes from negative 1 to5 then I'm
[841839.00s] going to flip that
[844240.00s] around to
[846399.00s] get W of in that means that this little
[850279.00s] thing flips across the axis and now I'm
[852160.00s] going to
[853880.00s] get
[856639.00s] this going from 1 to five and then I'm
[860800.00s] going to scale that by two which means
[862160.00s] I'm going to compress
[864000.00s] it so what you know zero stays zero what
[868079.00s] used to be two becomes
[870240.00s] one what used to be four becomes two and
[873880.00s] everything else goes
[876600.00s] away and so this is my final answer
[879800.00s] right again if I wanted to I could check
[881880.00s] I could say okay well you know what is
[884800.00s] you know y of
[886639.00s] 2 y of 2 is
[890160.00s] X of -1 right and I can see that yes
[894880.00s] this guy matches this guy over here what
[898480.00s] is y of uh one y of 1 is going to be X
[904920.00s] of one right so this guy matches this
[908320.00s] guy so everything turned out
[910959.00s] okay and I am kind of you know taking
[915920.00s] for granted that anything that I don't
[917440.00s] plot is zero okay so I guess I put a
[920079.00s] zero here only because that corresponds
[921680.00s] to this zero here but in general you
[923600.00s] know for a digital signal if I don't
[924839.00s] tell you otherwise you know all the
[926959.00s] stuff on the x-axis continues to be
[930880.00s] zero okay so any questions about this
[936199.00s] example
[939480.00s] okay so some properties of signals that
[943279.00s] we need to kind of talk about are your
[945920.00s] old friends even and odd and periodic
[948880.00s] and stuff like that and so uh a signal
[952800.00s] is
[955279.00s] even if basically it looks the same as
[958639.00s] it
[959800.00s] flipped
[960920.00s] around the Y AIS right so a signal that
[964959.00s] looks like
[969560.00s] this is
[972079.00s] even a signal is odd if it's kind of
[977079.00s] like the negative of itself flipped
[979160.00s] across the
[981120.00s] axis so by definition if I plug in zero
[987639.00s] here what I get is this equation which
[990959.00s] tells me that the middle entry of an odd
[993360.00s] signal always has to be zero and then
[996040.00s] it's kind of like a mirror image of
[999240.00s] itself around the Y
[1002600.00s] AIS okay and every signal has an even
[1006600.00s] part and an odd part and so
[1013839.00s] um every
[1016120.00s] signal has even and odd parts
[1023759.00s] which means that I can say Okay X of
[1027079.00s] n is equal to well let me let me say
[1030439.00s] this way the even part of X of n i can
[1033679.00s] compute it by looking at the
[1037400.00s] signal and flipping it around and
[1040439.00s] averaging those two things and I can
[1042360.00s] look at the odd part of it
[1052919.00s] by making this
[1055240.00s] competition so let me just show an
[1057240.00s] example of that in mat lab to make it a
[1058720.00s] little bit clearer okay
[1061799.00s] so so let's make some sort of random
[1064039.00s] signal
[1074640.00s] um make it more interesting
[1080200.00s] okay so again there's this stem command
[1082640.00s] in mat
[1085520.00s] lab that plots for me the uh signal and
[1090760.00s] you can see that this signal is neither
[1092080.00s] even nor odd right it's just a bunch of
[1094159.00s] impulses um and to make it easier for me
[1097280.00s] to do in mat lab what I'm going to do is
[1098679.00s] I'm going to assume that the middle
[1100600.00s] value is zero I can do that by kind of
[1103080.00s] providing a um x- axis here so now you
[1108000.00s] can see that the middle value here is at
[1111760.00s] zero and this signal goes between -4 and
[1114120.00s] 4 okay so how do I get the even and the
[1116480.00s] odd Parts well I'm going to make a uh
[1121320.00s] you know a Negative X which is basically
[1123440.00s] going to be the flipped version of X
[1126000.00s] luckily there's a mat lab command that
[1127360.00s] lets me do this flip left to right of
[1131080.00s] X and so if I make another figure I can
[1135880.00s] look at
[1144799.00s] that right so here's the original
[1147840.00s] X move it and here's the flip X right so
[1153280.00s] I can see that I've mirror imaged these
[1154679.00s] guys and then if I want to get the even
[1156720.00s] part of
[1157840.00s] X I would take uh X plus
[1163080.00s] the fth part of X which is NE X and
[1167039.00s] divide by two and and the odd part of X
[1170880.00s] would be x - IG x /
[1175799.00s] 2 and now if
[1181840.00s] I do these
[1186120.00s] things
[1188159.00s] but I this
[1193679.00s] wrong oh in show I'm teaching image
[1196360.00s] processing instead of uh DSP
[1204039.00s] and make this guy
[1211640.00s] here okay so here's the even part of
[1214400.00s] X and here's the odd part of it so I can
[1217320.00s] see that these signals obey the
[1219400.00s] properties that I talked about before
[1220760.00s] right the even part is nicely symmetric
[1222200.00s] around zero the odd part has this this
[1224440.00s] odd Symmetry and I can verify that um
[1228400.00s] when I add even part of
[1230919.00s] X and odd part of X back together I get
[1234559.00s] the original
[1236799.00s] signal
[1243360.00s] so here's the original guy and here's
[1247480.00s] the original guy right so and I can see
[1249520.00s] why this works like if I switch back to
[1251159.00s] my uh document I can kind of see that
[1254720.00s] obviously that this plus this you know
[1258000.00s] these negative parts are going to cancel
[1259440.00s] out and these guys add up to just the x
[1261280.00s] of n again right what's Maybe not
[1263159.00s] immediately clear is why these formulas
[1266159.00s] are guaranteed to produce an even signal
[1268200.00s] and an odd signal and so that may be one
[1269799.00s] of the homework problems for example is
[1271120.00s] proving that this signal has to be even
[1273039.00s] that signal has to be odd
[1275480.00s] okay so any questions about this
[1279080.00s] example so the reason we care about even
[1281320.00s] odd signals will be important when we
[1283240.00s] get to things like understanding the for
[1285360.00s] transform and how the real and imaginary
[1287039.00s] parts of the for transform related to
[1288559.00s] signal stuff like that so we want to
[1289840.00s] cover that
[1292080.00s] now another key property is periodicity
[1296000.00s] okay that was really important in
[1297960.00s] continuous time it's still important in
[1299679.00s] discreet time and
[1302840.00s] so
[1307000.00s] periodicity all this means is that the
[1309080.00s] signal repeats itself after a
[1313240.00s] certain number of integer steps
[1317000.00s] okay so for example I could have a
[1319120.00s] signal that looks
[1323720.00s] like
[1326760.00s] this and I would say that the period of
[1329159.00s] this signal is four meaning that it
[1334279.00s] repeats itself every four units and I
[1336320.00s] have to remember that it goes this way
[1346120.00s] too okay and and you
[1350320.00s] know actually a constant signal is also
[1353279.00s] periodic right a signal that has the
[1355400.00s] same value all the
[1359640.00s] time you
[1361559.00s] know a constant by its Nature has period
[1366320.00s] one
[1369600.00s] okay and so period oxal are going to be
[1371840.00s] super important for us largely because
[1374120.00s] we're going to be dealing with different
[1375240.00s] kinds of discrete time signs and cosin
[1382159.00s] okay so far so
[1386039.00s] good so let's talk about um your old
[1390080.00s] friend the Delta function okay so the
[1392720.00s] nice thing is that in the discreet time
[1395039.00s] world everything is nicely representable
[1397240.00s] by a stick on a graph that you can make
[1398919.00s] in mat lab right so no more weird
[1400880.00s] convolution integrals stuff like that so
[1403640.00s] special
[1404720.00s] signals so special signals
[1413080.00s] so a key one is the Delta function okay
[1417320.00s] so that's just defined as being equal to
[1419960.00s] 1 at Nal 0 and zero everywhere
[1424480.00s] else very simple
[1439159.00s] and we represent this with a Greek
[1443039.00s] Delta okay equally important is the uh
[1446720.00s] step function unit step function so that
[1450039.00s] equals 1 when n is greater than or equal
[1453279.00s] to Z and Z when n is less than
[1457400.00s] zero so that means that this is like a
[1459679.00s] signal that is off prior to zero and
[1463799.00s] then it turns on at zero and it stays on
[1471159.00s] and we usually denote this by U of n
[1475080.00s] where the U usually stands for unit and
[1476919.00s] step function okay so as with other
[1480559.00s] electrical engineering classes it's
[1481840.00s] always really important to label your
[1483960.00s] axes well enough that I know what's on
[1486480.00s] the xaxis what's on the y- axis right so
[1488320.00s] here I'm making sure that you know that
[1489720.00s] the height of these dots is one
[1493679.00s] okay now the unit the unit step function
[1497120.00s] and the Delta function are related to
[1498559.00s] each other okay um and so you may
[1500880.00s] remember that in continuous time there
[1502559.00s] was this kind of derivative integral
[1504760.00s] relationship between Delta and step here
[1506799.00s] it's kind of like looking at sums and
[1508679.00s] differences okay and so one thing to
[1511880.00s] think about is that this step function
[1514799.00s] here can be thought of to be made up of
[1518159.00s] a bunch of Delta functions right that
[1520120.00s] idea of taking a signal apart into its
[1522200.00s] component pieces is really important to
[1524520.00s] what we're going to talk about next and
[1526039.00s] so one way I think about this is that
[1528360.00s] the unit step function looks like well
[1533240.00s] what is the first entry it's the step
[1535279.00s] it's the Delta function what is the next
[1537520.00s] entry it's the Delta function shifted by
[1540320.00s] one unit and then shifted by two units
[1543880.00s] and so on plus dot dot dot and the way I
[1547240.00s] look about this the thing way I think
[1548520.00s] about this more mathematically is this
[1550000.00s] is the sum from k equals 0 to Infinity
[1553799.00s] of the Delta function shifted
[1556840.00s] by you know some positive number of
[1564720.00s] units
[1566240.00s] okay so that's definitely true that's
[1568440.00s] like taking apart the signal into just
[1570559.00s] its stick pieces okay another slightly
[1575279.00s] trickier way of thinking about the step
[1576880.00s] function and the Delta function is
[1578799.00s] saying okay well let me put this back
[1581080.00s] for a second another way I can think
[1582520.00s] about this is just in the same way that
[1585039.00s] when you uh do continuous time you have
[1588600.00s] a let me just draw The Dread Arrow for
[1591320.00s] one second right so the way we talked
[1593080.00s] about the step function in serious time
[1601159.00s] was no let's look at this again right so
[1603600.00s] this is basically saying that the way I
[1605000.00s] get the step function is I take
[1608440.00s] basically this guy and I add to it this
[1612480.00s] sky and I add to it this guy right but I
[1615919.00s] don't want to add the ones that are
[1616960.00s] negative right so it has to start start
[1618480.00s] only at zero right if I went all the way
[1621279.00s] from minus infinity I just have a
[1622440.00s] constant right it would just be one all
[1624320.00s] the way
[1625840.00s] across other
[1628520.00s] questions feel free to stop me at any
[1630559.00s] time okay so the way that we talked
[1633159.00s] about the continuous time Delta and step
[1636440.00s] was that this continuous time Delta
[1639480.00s] function was like a little unit amount
[1643840.00s] of energy that when I integrated across
[1646360.00s] whenever I bumped across the Delta
[1647720.00s] function I would accumulate one unit and
[1649200.00s] so if I were to look at the uh integral
[1652720.00s] I know I promis not to do this from uh
[1655399.00s] say
[1656360.00s] toal minus infinity to
[1659399.00s] T of
[1663200.00s] the Delta function I got the step
[1665720.00s] function what did that mean just meant
[1667320.00s] that if I you know integrate up to here
[1671159.00s] I get zero if I inte to here I get zero
[1673880.00s] if I integrate just over the Delta
[1676279.00s] function I get one and then I get one
[1678200.00s] forever more right so the same way of
[1680120.00s] thinking about it applies to the Delta
[1681559.00s] function right so here's the Delta
[1684000.00s] function so here's my discrete time
[1687480.00s] Delta function what I can say is okay I
[1690360.00s] can think of the unit step function as
[1695080.00s] the sum from K = minus infinity to uh
[1703279.00s] n of Delta of K so what does that mean
[1709159.00s] right this is a little bit confusing but
[1711320.00s] let's think about what it means it means
[1712440.00s] basically what is the value of the step
[1715480.00s] function at say
[1718519.00s] -3 well I plug in3 to this infinite sum
[1721840.00s] and I ask myself okay I'm going to add
[1723240.00s] up all the values of the Delta function
[1725360.00s] up from minus infinity up to3 I add up
[1728120.00s] those values and I get zero right
[1729880.00s] because nothing has happened yet so I
[1732200.00s] can put down zero here what about unit
[1735559.00s] step function at negative 1 again I add
[1737279.00s] this up I add up to here and I get
[1741200.00s] zero what happens when I put in zero
[1744399.00s] well from negative infity to zero
[1746399.00s] suddenly I add this one unit of stuff
[1749120.00s] right so now I jump up to
[1752120.00s] one now suppose I put in n equals 5
[1755440.00s] right that's like saying add everything
[1756600.00s] up from the left hand side all the way
[1757919.00s] up to five well I've only ever got that
[1759519.00s] one unit right so basically after I bump
[1762240.00s] over the
[1764559.00s] one you know piece of stuff in the
[1766840.00s] middle I never accumulate anything else
[1768919.00s] right so this is another way of thinking
[1771240.00s] about the relationship between the unit
[1772760.00s] fun the unit set function and the Delta
[1774360.00s] function that makes it look a little bit
[1775880.00s] more like the continuous time integral
[1778919.00s] version that we used in signals and
[1780480.00s] systems right the idea is the same right
[1782600.00s] so in continuous time the step function
[1784760.00s] was What I Got by integrating the Delta
[1786399.00s] function up to some point the same thing
[1787919.00s] is true here ex I can't integrate
[1789480.00s] because I'm not in continuous time the
[1790720.00s] only thing I can do is add right so if I
[1792840.00s] keep on adding stuff up I eventually get
[1795200.00s] things to work out okay so this is kind
[1798559.00s] of like you know the
[1801600.00s] analogy between you know
[1806159.00s] integration and what I would call a
[1808919.00s] running
[1814960.00s] sum
[1816480.00s] okay so comments or questions on
[1823200.00s] that okay the other way around is a lot
[1825640.00s] easier right so we know that
[1828799.00s] in continuous
[1831399.00s] time if I had my continuous
[1836039.00s] time step
[1838039.00s] function and my continuous time Delta
[1844640.00s] function the idea was that you know the
[1847200.00s] Delta function is what I get by taking
[1848600.00s] the derivative of the SE function right
[1851200.00s] so the
[1852760.00s] derivative almost everywhere is zero
[1855559.00s] right whenever this function is flat get
[1858120.00s] a zero derivative right the only place I
[1860080.00s] don't get a zero derivative is where the
[1862360.00s] function jumps up to one and that's why
[1865840.00s] this Delta function jumps up to one
[1868399.00s] right technically the derivative of this
[1870399.00s] function at zero is not really well
[1872880.00s] defined uh for what you guys know right
[1875039.00s] now it's like Infinity right so it's
[1876679.00s] like the slope is infinitely high and
[1878679.00s] that's you know kind of why we have this
[1880240.00s] Arrow here instead of an actual dot
[1882639.00s] right that was all very confusing back
[1884440.00s] when you took signals life is much nicer
[1886760.00s] here in digital world
[1889799.00s] so again here's my digital version of
[1893600.00s] the set
[1896200.00s] function and here's my digital version
[1898559.00s] of
[1899799.00s] the Delta
[1903320.00s] function
[1907320.00s] and here I can see how would I kind of
[1910240.00s] do the discret time version of
[1912919.00s] differentiation well that's like taking
[1914720.00s] a difference between you know how did
[1916760.00s] you learn about derivatives in the first
[1918200.00s] place right you kind of took a you know
[1921039.00s] signal and you shifted a little bit and
[1923200.00s] you subtracted them and you kind of made
[1924919.00s] that shift smaller and smaller right so
[1926639.00s] the idea here is that if I look at the
[1929120.00s] shift the delay of the Delta function
[1932000.00s] step function by one unit if I delay
[1934679.00s] that guy by one unit that means it
[1936240.00s] starts
[1937480.00s] at one instead of starting at
[1942320.00s] zero and now if I say okay well I could
[1945480.00s] subtract this from that what would be
[1948159.00s] left would be just the Delta function so
[1949799.00s] I could say the Delta function is like
[1952639.00s] the difference
[1957519.00s] between two step functions right the
[1960840.00s] shifted one and the regular one right
[1962559.00s] and the analogy there is kind of like
[1964919.00s] you know
[1967679.00s] this is the analogy that we used
[1970840.00s] in uh continuous
[1973799.00s] time the nice thing about the DSP part
[1976720.00s] is that there's no need to understand
[1977919.00s] any of this weird integration Delta
[1980519.00s] function stuff right this is very direct
[1982760.00s] right I just take this shift it and
[1984039.00s] subtract it and I get that right so
[1986279.00s] another way that digital SLE processing
[1987840.00s] is a little bit easier than
[1991360.00s] Contin
[1993120.00s] okay so now I want to kind of put this
[1995360.00s] together right so let's talk about um
[1999919.00s] just like I made the step function up
[2001559.00s] out of Delta function pieces I can do
[2003880.00s] that with any signal right so
[2008039.00s] let's say um you
[2011159.00s] know making a signal out of Delta
[2022919.00s] functions so let's suppose I have just
[2024840.00s] some kind of arbitrary
[2031279.00s] signal okay well I can write this like
[2037440.00s] just
[2038880.00s] the component
[2041679.00s] pieces right so it's like saying just
[2044159.00s] give me
[2045399.00s] this
[2047639.00s] stick and then give me this stick by
[2051599.00s] itself and then give me this stick by
[2056839.00s] itself right each of these is like a
[2059359.00s] scaled and shifted Delta function right
[2062560.00s] and so if this guy was one high and this
[2066119.00s] guy was negative one and this guy was
[2068919.00s] two then this is basically like saying
[2070839.00s] well this is like 1 times the Delta
[2074839.00s] function that hasn't been shifted at all
[2077760.00s] right this guy is
[2080679.00s] like1 times the Delta function that has
[2083480.00s] been shifted by one
[2085480.00s] unit this guy is like
[2088399.00s] two times the Delta function that has
[2091440.00s] been shifted by two units and so on
[2096079.00s] right and so what I can write is that my
[2100680.00s] signal my
[2102480.00s] signal is like the infinite
[2105200.00s] sum from K = minus infinity to Infinity
[2112000.00s] of X of
[2115680.00s] K time Delta of nus
[2122680.00s] K right what that's saying is
[2126280.00s] that at every position right so at every
[2131240.00s] value of K I multiply the Delta function
[2133560.00s] by the corresponding value of x and then
[2135920.00s] I add all those guys up right so this is
[2137720.00s] a way of taking apart the signal into
[2139920.00s] each of the pieces
[2143880.00s] okay so that's good um we're going to
[2147680.00s] use that formalism a lot when we come to
[2151079.00s] things like you know convolution and
[2153520.00s] sometimes you know another way to think
[2155079.00s] about this that's kind of like um
[2161800.00s] there's another way of looking at this
[2163359.00s] so this is kind of I forget what I would
[2165119.00s] call this but okay so this is one
[2166720.00s] property I'll draw a box around
[2169680.00s] it another property is What's called the
[2172400.00s] sampling
[2181599.00s] property which is that let's suppose I
[2184240.00s] do a similar looking sum
[2202880.00s] so first of all let's think about what
[2204160.00s] this means right this is like saying
[2206359.00s] okay
[2208800.00s] um I have
[2212079.00s] a signal let's think about that as a
[2215040.00s] signal as a function of K right so again
[2218280.00s] this could be
[2223119.00s] anything what is Delta of K minus n well
[2227440.00s] that's like saying I've got a Delta
[2229240.00s] function that is shifted that is delayed
[2231359.00s] to start
[2233160.00s] at
[2242240.00s] n right so what do I get when I multiply
[2247119.00s] these singles together and add them all
[2248800.00s] up well I'm going to be multiplying
[2251560.00s] together a lot of zeros right so
[2253160.00s] everywhere
[2255240.00s] where one of these guys hits a zero the
[2258079.00s] product of those two things is going to
[2259119.00s] be zero the only time I'm not going to
[2260839.00s] get
[2262760.00s] um a nonzero answer is right at the
[2268160.00s] point where the Delta function is firing
[2269960.00s] and so what do I get at that point well
[2271720.00s] I get
[2273839.00s] whatever this number happens to be it's
[2276000.00s] like saying I multiply this
[2278040.00s] value by one and what I get is X of
[2284920.00s] n
[2287319.00s] okay so again this is just kind of like
[2290440.00s] an exercise in saying that you know I
[2292880.00s] can use a Delta function to kind of pick
[2295240.00s] off any value of the signal that I want
[2298480.00s] right by multiplying it and adding it up
[2307599.00s] okay any questions about either of those
[2310640.00s] two
[2315960.00s] formulas okay
[2319119.00s] so more kind of bookkeeping is complex
[2322240.00s] numbers right so everyone has to
[2323760.00s] remember complex numbers from whenever
[2326200.00s] you saw that material right so we're
[2328119.00s] going to learn we're going to use a lot
[2330599.00s] of complex numbers so complex number
[2335480.00s] review review
[2340960.00s] so most of the time or not most of the
[2343440.00s] time but often we
[2347200.00s] will talk about a complex number like
[2349640.00s] this where this is the real
[2354680.00s] part and Y is the imaginary
[2360720.00s] part and we call this uh cartisian or
[2364160.00s] rectangular coordinates
[2373640.00s] so sometimes we'll call this like real
[2376040.00s] of Z and
[2378920.00s] M of
[2381000.00s] Z where here J is as we know the square
[2384480.00s] root
[2386520.00s] of1 and I think I'm most of most of the
[2388760.00s] time I'm going to use J in this class
[2390200.00s] and not I you may catch from using I but
[2392240.00s] I think that J is better uh another
[2394359.00s] thing you may find is the polar version
[2397160.00s] which which is something like
[2400599.00s] this where this is the
[2405319.00s] magnitude which we sometimes call Z and
[2408640.00s] bars and this is the
[2412760.00s] angle or the
[2415280.00s] phase which you sometimes see called
[2418000.00s] like angle of Z with this little angle
[2420720.00s] guy and this is called polar coordinates
[2428160.00s] and there are some key relationships
[2430040.00s] between all these guys right so uh the
[2433319.00s] key property that defines these
[2437400.00s] relationships is Oilers formula which
[2441800.00s] says that if I have e to the J Theta
[2444839.00s] right that's a complex number that is
[2446520.00s] represented by cosine theta plus J sin
[2453359.00s] Theta right so this is the real part of
[2456040.00s] e the J Theta this is the imaginary part
[2457920.00s] of e j Theta that's what I use to go
[2459960.00s] back and forth between converting these
[2461480.00s] things right and so if I need to have
[2464760.00s] explicit formulas that's like saying
[2466640.00s] okay if I have a point out here I can
[2470040.00s] either call it you
[2473240.00s] know x +
[2475400.00s] JY or I can call it
[2478440.00s] r e of the J Theta right those are
[2481160.00s] equivalent ways of talking about the
[2483040.00s] same complex number Z out here and I
[2486240.00s] convert back and forth between them by
[2487800.00s] say okay well if I want to go from
[2489560.00s] cartisian to Polar my R is just the
[2494160.00s] hypotenuse of this triangle and my Theta
[2498119.00s] is the
[2499319.00s] arctangent of
[2502480.00s] YX right I'm looking at you know this is
[2506119.00s] the opposite this is the
[2508400.00s] adjacent and going the other way if I
[2510680.00s] know the radius and the angle I want to
[2512119.00s] get cartisan coordinates then I say that
[2514240.00s] X is the radius times the cosine and Y
[2518119.00s] is the radius times the
[2521319.00s] sign and all this stuff just Falls right
[2523800.00s] out of Oiler formula you can always
[2525839.00s] rederive this stuff if you need
[2528920.00s] to uh another formula that you probably
[2531319.00s] remember from way back when is that uh
[2534760.00s] if I want to look at you know if I go
[2536640.00s] back
[2537359.00s] to cosine
[2540680.00s] Theta that's the same as this
[2547280.00s] old your old buddy right so why is this
[2550240.00s] true this is like saying that if I have
[2552680.00s] you know cosine theta plus J sin theta
[2557200.00s] plus if I use oiler on this I have cosga
[2560400.00s] theta plus J sin Theta I know that
[2564760.00s] cosine of thet and negative Theta is the
[2568440.00s] same and the signs are opposite
[2572319.00s] right so that means that I
[2575599.00s] have2 of to cosine Theta which is cosine
[2579400.00s] Theta and the same way sin Theta is 12
[2585319.00s] of or 1 over 2 J of e j Theta minus eus
[2591040.00s] J
[2594359.00s] thet so these conversion formula you
[2597640.00s] know you're going to need these a bunch
[2599559.00s] to go back and forth between cartisian
[2601000.00s] and polar and stuff like that hopefully
[2605720.00s] familiar okay
[2608400.00s] any questions about any of this complex
[2609920.00s] number
[2613440.00s] stuff okay
[2617680.00s] so let's talk for a second about uh
[2620960.00s] signs and cosiness
[2623280.00s] right so first let me talk about what
[2626160.00s] this is in uh you
[2631839.00s] know that's not how you spell
[2634920.00s] s sin it's
[2639720.00s] so let's talk about this in continuous
[2641720.00s] time just for a second because we're
[2642760.00s] going to use continuous time signs and
[2644240.00s] cosiness for
[2652440.00s] sure just to know what the parts of
[2654400.00s] these things are right so here this is
[2658599.00s] what I call the
[2662119.00s] amplitude this is what I call the
[2664079.00s] frequency
[2667880.00s] and this is what I call the
[2670440.00s] phase right and if I were to plot that
[2673240.00s] basically what I have is a signal looks
[2675680.00s] like this so normally so say the phase
[2678960.00s] was Zero the sign would start right at
[2680920.00s] zero and it would go like this if I have
[2684000.00s] a phase shift that means that you know
[2687559.00s] things are delayed by a positive or
[2690000.00s] negative amount and so in this case what
[2692359.00s] I get is kind of something looks like
[2693920.00s] this
[2697240.00s] where the sinus so goes back and forth
[2701520.00s] between plus and minus a a is always a
[2703960.00s] positive
[2704880.00s] number the peak to Peak period right
[2710079.00s] this distance here we sometimes call
[2712559.00s] this the period is 2 pi over Omega
[2718200.00s] 0 and the phase shift is related to this
[2723240.00s] feet
[2734559.00s] just as a quick you know check you know
[2739160.00s] the sinus is not shifted by Fe exactly
[2743599.00s] right because this kind of comes back to
[2745800.00s] what we talked about when we do uh
[2747920.00s] transformations of signals right first I
[2750720.00s] do the shift but then I have to do this
[2753200.00s] scale at the end right so this is
[2756079.00s] actually scale
[2757440.00s] by Omega 0 to figure out what the
[2759680.00s] intercept and on the X and Y AES are
[2763880.00s] okay so we know from continuous time
[2766680.00s] signal processing that we have this
[2768280.00s] concept of low frequency to high
[2770680.00s] frequency
[2773000.00s] okay so you know kind of the lowest
[2776440.00s] frequency well the lowest frequency they
[2777880.00s] can get is a is a constant I guess but
[2781480.00s] here's the idea is that you know this
[2783760.00s] could
[2784800.00s] be s t
[2787440.00s] and then if I
[2791160.00s] have sin 2T that's something that
[2794280.00s] Wiggles twice as
[2797160.00s] fast sin 3T is something that Wiggles
[2799760.00s] twice as three times as fast and so on
[2804160.00s] right and so the idea is there's this
[2806160.00s] kind of
[2807160.00s] Continuum from low frequency sinusoids
[2811240.00s] to high frequency cids
[2820079.00s] okay now we have the same idea here in
[2823480.00s] Signal processing but life is a little
[2826680.00s] bit different and a little bit easier
[2828920.00s] okay I'm going to come to that in in
[2830599.00s] just a second well I guess I can talk
[2831720.00s] about
[2832440.00s] it yeah I I can talk about it in just a
[2834920.00s] second okay the reason I'm deferring is
[2837160.00s] I also want to mention about uh
[2838800.00s] exponentials right so exponentials are
[2840520.00s] also things we come across in single
[2842640.00s] processing all the time
[2845200.00s] so exponentials
[2852280.00s] again sticking to continuous time for a
[2853800.00s] second are basically functions that grow
[2857839.00s] or Shrink in a certain
[2860480.00s] way so here you know C and
[2864400.00s] A are real
[2868680.00s] numbers so if a is
[2872359.00s] positive that means that the exponential
[2874880.00s] is growing like this right right and the
[2878599.00s] value here is
[2881359.00s] C and if a is negative it means that
[2886000.00s] things are shrinking like
[2888920.00s] this so this is where you get things
[2891000.00s] like you know explosions and compound
[2893119.00s] interest and stuff like this this is
[2894599.00s] where you get things like delay and
[2896079.00s] friction and stuff like that right so
[2897880.00s] things are speeding up or they're
[2898960.00s] slowing
[2900520.00s] down so let's talk for a minute about
[2902800.00s] you know how do I handle this quantity
[2906359.00s] when C and A are actually complex
[2909000.00s] numbers right that makes things a little
[2911319.00s] more
[2912800.00s] complicated
[2915680.00s] so what
[2918520.00s] about uh this
[2923280.00s] signal
[2925280.00s] when C and
[2927359.00s] A are
[2931760.00s] complex
[2933480.00s] well little tricky right so I mean like
[2935799.00s] it's not immediately clear how would I
[2937280.00s] handle something like you know 2 + 3 j e
[2940839.00s] to the you know -1 - 2 J
[2945119.00s] T
[2946880.00s] right does that mean something sure it
[2949200.00s] does and the best way to do it is to
[2951160.00s] convert these numbers from cartisian
[2953400.00s] into Polar coordinates and so remember I
[2956319.00s] can always write c as let's say the
[2959920.00s] magnitude e the J Theta and I can write
[2963720.00s] a as r +
[2969520.00s] okay I guess what I'm doing is I'm
[2970480.00s] writing this in polar and this in
[2977520.00s] rectangular I guess I'm kind of making
[2979240.00s] things a little bit confusing because
[2980160.00s] I'm using R and C in the wrong way but
[2981880.00s] all right so how would I work this out
[2984799.00s] then I would say well X of T is the
[2988599.00s] polar version of
[2989960.00s] c e to the cartisian
[2995160.00s] part of t
[2997599.00s] and now I can kind of say okay I can
[2998839.00s] separate this out into some purely real
[3000799.00s] stuff and some purely imaginary stuff
[3003440.00s] purely real stuff
[3005839.00s] is c e the RT right that's kind of like
[3009760.00s] saying that I have this real envelope on
[3013520.00s] a sinus way that looks like Omega t+
[3019319.00s] Theta or a different way of saying this
[3021440.00s] is that I can now write this like cosine
[3026319.00s] Omega 0 t + th plus J sin Omega 0 t
[3033559.00s] + right
[3036520.00s] so what I can see here is that the real
[3039119.00s] part if I forget about the J the real
[3041079.00s] part is purely a cosine multiplied by
[3045920.00s] this exponential function and the
[3048520.00s] imaginary part is similar except it's a
[3050000.00s] sign instead of a coine and so what does
[3052680.00s] that kind of mean well if I imagine that
[3055400.00s] this here suppose that this is a
[3056839.00s] decreasing exponential what it means is
[3059480.00s] that I have kind of like this
[3065000.00s] envelope so this is like my envelope of
[3068440.00s] c e to the RT if R is less than zero and
[3072880.00s] then the real part of the
[3078160.00s] signal is some cosine that is kind of
[3083000.00s] you know oscillating within this
[3085200.00s] envelope
[3089400.00s] like
[3091400.00s] that right if R equals zero then I don't
[3094440.00s] have any oscillation at all just a
[3096359.00s] regular cosine or a sign but if R is
[3099079.00s] negative or positive then I either have
[3100720.00s] an expanding cosine or a Contracting
[3102720.00s] coine so what it comes down to is that
[3105760.00s] this thing is kind of this complex it's
[3110040.00s] that it's that Sur a complex sinus so
[3111799.00s] it's modulated by this exponential
[3114160.00s] function but it has a notion of a
[3116760.00s] frequency right I can't really say this
[3118720.00s] function is periodic because it doesn't
[3120520.00s] strictly repeat itself right it's always
[3122559.00s] changing its amplitude but there is this
[3124799.00s] sense of a period inside this envelope
[3128000.00s] okay and so that's why real that's why
[3131000.00s] sinusoids and exponentials are kind of
[3132480.00s] related to each other that's why I want
[3134079.00s] to talk about them together and
[3137040.00s] so life is similar in discreet time
[3139599.00s] right this is all continuous Time stuff
[3141200.00s] but you know in a similar way
[3149520.00s] we're going to come across signals that
[3150839.00s] are kind of like this where I have a
[3152480.00s] discrete time signal that is some
[3155359.00s] constant times some number to the N
[3158760.00s] power which I can think of as constant
[3162720.00s] you know e to the BN where Alpha is e to
[3168559.00s] the B right and this is exactly in the
[3171160.00s] form of this you know uh this time
[3174920.00s] domain exponential time science so again
[3177000.00s] I could say in the same way this is like
[3185160.00s] this you know some real part and some
[3189079.00s] imaginary
[3192480.00s] part okay
[3196359.00s] so last thing I want to talk about is
[3198680.00s] kind of periodicity in the discrete time
[3202280.00s] world okay so we talked about how in the
[3206040.00s] continuous time world I could have SS
[3209240.00s] and cosiness just keep on increasing in
[3212839.00s] frequency right so if I look at this
[3215599.00s] picture you know there's nothing to
[3217920.00s] prevent me from continuing to oscillate
[3220000.00s] faster and faster right so I can talk
[3222000.00s] about cosine of 40,000 you I can talk
[3224520.00s] about cosine of 40,000 Hertz or 400,000
[3226839.00s] htz and things can just go faster and
[3228520.00s] faster but that that is not true in
[3231040.00s] discreet time okay so uh discreet time
[3234640.00s] sinusid are a little bit different
[3247280.00s] and a key reason for that is the
[3249960.00s] following so let's take a look at you
[3252880.00s] know suppose I've got some sort of a uh
[3256960.00s] sinusoid
[3259319.00s] of
[3262160.00s] uh so here's an example of a discreet
[3264480.00s] time sinusoid you know
[3268319.00s] what
[3270240.00s] is e to the J Omega 0+ 2 pi
[3278079.00s] n okay so this is say okay I'm going to
[3280559.00s] take my frequency I'm just going to add
[3282079.00s] 2 pi to it right so that in theory in
[3285200.00s] the continuous time world would be a
[3287559.00s] faster a higher frequency sinusoid what
[3290520.00s] happens here well I can work this out I
[3293640.00s] get e to the J Omega 0 n
[3297480.00s] plus J 2i
[3300520.00s] N which is
[3302760.00s] like e to the j 2i n e to the J Omega 0
[3308240.00s] n but now I see that you know
[3310760.00s] n is always an integer right we're in
[3313640.00s] discreete time world now so what that
[3316440.00s] means is that you know if I think
[3319480.00s] about Nal 0 that's like saying e to the
[3323280.00s] j0 that puts me here on the circle if n
[3326559.00s] equals 1 that means I come around and
[3328480.00s] I've gotone one full circle so I got e
[3330200.00s] of the J 2 pi that's also one if n
[3333400.00s] equals 2 I'm gone around twice and I
[3335079.00s] have e the j4 pi that's also one right
[3336960.00s] so this whole this whole guy turns into
[3339200.00s] one and that means
[3341799.00s] that when I add 2 pi to any frequency I
[3346599.00s] end up getting the same frequency again
[3348799.00s] right this means that there is no kind
[3351640.00s] of like infinitely high frequencies in
[3354520.00s] discreet time world we can only go up to
[3356559.00s] a certain amount in fact that you know
[3358960.00s] we now have this idea that
[3364240.00s] uh
[3366520.00s] there's only a 2 pi wide kind of
[3373200.00s] range of frequencies in discreete
[3383680.00s] time and that's good right so
[3387000.00s] just in the same
[3389559.00s] way you know if I have
[3393960.00s] uh Omega equals
[3396240.00s] 0 what does that mean that's like saying
[3398480.00s] e to the 0 n that's just constant all
[3401440.00s] the time right so just like
[3407359.00s] in
[3409200.00s] uh you know just like in continuous time
[3411839.00s] world the lowest frequency thing I can
[3413400.00s] get is something that's just constant
[3414799.00s] right so here this is is like lowest
[3420839.00s] frequency what's the highest frequency
[3422960.00s] thing that I can get well the highest
[3424720.00s] frequency thing I can get is something
[3425880.00s] that basically is flipping back and
[3427240.00s] forth as fast as I can possibly make it
[3429319.00s] go and that's simply this signal right
[3433160.00s] so this is about as fast as I can make a
[3437920.00s] digital sinusoid go right it alternates
[3440720.00s] between its maximum and its minimum
[3442119.00s] amplitude as quickly as possible right
[3445079.00s] and this is corresponding to Omega equal
[3447799.00s] PI right because e Pi n well if n is uh
[3455319.00s] even I get an even multiple of Pi which
[3457839.00s] means I get uh one if n is
[3462359.00s] odd I get an odd multiple Pi which means
[3465119.00s] n is minus one right that's like saying
[3467400.00s] that the signal is bouncing back and
[3468799.00s] forth between here and here on the
[3471960.00s] complex plane right and so this is
[3480440.00s] frequency and so what this means is that
[3484039.00s] in DSP we no longer have to draw these
[3487200.00s] kind of charts of frequency that kind of
[3490359.00s] go arbitrarily far out on the xais right
[3493000.00s] we're going to draw a lot of pictures in
[3494359.00s] this class that fundamentally look
[3498359.00s] like uh this so for example if I want to
[3501119.00s] design a low pass
[3503319.00s] filter so let's say a discrete time
[3507960.00s] or
[3511079.00s] digital low pass
[3515920.00s] filter what that would look like would
[3518440.00s] be something like this where I say okay
[3520799.00s] this is high frequency and for reasons
[3523480.00s] that we'll talk about in the next couple
[3524720.00s] weeks there's a there's a symmetry that
[3527240.00s] basically will say for most of the
[3528359.00s] filters that we care about the frequency
[3530400.00s] response will be symmetric around zero
[3532480.00s] that means that I could have a filter
[3534359.00s] that looks like you know this is like
[3535839.00s] the ideal low pass
[3540680.00s] filter and in practice you know we're
[3543880.00s] going to talk about how I can't obtain
[3546760.00s] this low pass filter with a limited
[3550039.00s] length or finite impulse response filter
[3552359.00s] so in practice the filter that we design
[3555039.00s] may look something that's more funky
[3556920.00s] like
[3557720.00s] this and you may have remembered seeing
[3559760.00s] some pictures like this back in
[3562160.00s] continuous time signals so we're going
[3563680.00s] to talk about you know how do I make my
[3566160.00s] actual design filter frequency response
[3568640.00s] look as close as possible to this that's
[3570520.00s] a topic for a different
[3572799.00s] day um so last thing I want to mention
[3576119.00s] so let me pause and ask any questions
[3577559.00s] about
[3580599.00s] that okay last thing I want to say is
[3583359.00s] that you need to be careful when
[3585640.00s] assessing whether a given signal is
[3588960.00s] periodic in the discret world right so
[3592400.00s] you're probably used to thinking that
[3593480.00s] well any cosine is periodic because
[3596440.00s] that's what cosiness do right that's not
[3598640.00s] exactly true so when
[3602119.00s] is e to the J Omega 0 n
[3608079.00s] periodic and remember this is discreet
[3614640.00s] time well what that means is that I have
[3617920.00s] to have e to the J Omega 0 n + n capital
[3623720.00s] N equal this for for
[3627559.00s] some integer
[3632000.00s] n right so here not immediately obvious
[3637319.00s] so that means that this has to be e the
[3640160.00s] J Omega 0 n e the J Omega 0 capital N I
[3645680.00s] need this guy to equal one right and
[3649200.00s] what does that mean that means that I
[3650480.00s] need to land over here on the complex
[3654799.00s] plane which means that this number this
[3657760.00s] Omega 0 n has to be you know
[3662200.00s] basically uh some even multiple of Pi
[3666839.00s] right this has to be either zero or it
[3669480.00s] has to be 2 pi or 4 Pi or something for
[3671640.00s] some
[3674720.00s] integer okay so that means that my
[3680920.00s] frequency has to look like this
[3686480.00s] or kind of conversely the period looks
[3689720.00s] like
[3694799.00s] this so let me just make this a little
[3696720.00s] bit more concrete right so let's suppose
[3698640.00s] I have
[3701280.00s] uh suppose I have
[3705160.00s] cosine of 4 pi over
[3709440.00s] 5 yeah that's my
[3713079.00s] signal well let's go back to my formula
[3716400.00s] here right this is like saying this is
[3718200.00s] my formula for the period n = 2
[3723760.00s] pi
[3725400.00s] K
[3727000.00s] over 4 pi over
[3729400.00s] 5 I need this to be an integer
[3737520.00s] right so what do I got I got basically
[3741359.00s] plus I basically uh 10
[3746000.00s] Pi K over 4 Pi which is the same thing
[3749480.00s] as saying I have 5 over 2 K so for this
[3751960.00s] to be an integer I need to have uh k = 2
[3755960.00s] which means that n = 5 so this signal is
[3765880.00s] periodic with period
[3770559.00s] five and I can verify that if I just go
[3773240.00s] over here
[3778680.00s] so if I have you know
[3783319.00s] some time to main thing and I say that X
[3787640.00s] is uh cine of 4i 5 *
[3796520.00s] n and I plop these
[3801279.00s] guys right so I can see here whoops I
[3803839.00s] can see here that this is indeed
[3807319.00s] that touch screen this is indeed
[3811000.00s] periodic with period five right it
[3812880.00s] repeats every five units starting at
[3816319.00s] zero and then I get this kind of weird
[3819440.00s] behavior and then I get this repeat over
[3821279.00s] here at five right but not every discret
[3825760.00s] time thing that looks like a coine is
[3827920.00s] periodic right what about you know X of
[3830520.00s] n equal cosine of 7n right so Norm in
[3836319.00s] continuous time you'd say yes this guy
[3837880.00s] is periodic and has a period of 2 pi
[3839760.00s] over 7 but 2 pi over 7 is not an integer
[3842559.00s] right and furthermore there is no
[3844680.00s] integer that will you know basically
[3847480.00s] make this
[3850920.00s] guy some integer value right nothing I
[3854640.00s] can do so uh what does that mean if I
[3858279.00s] were to look at cosine of 7n over here
[3860200.00s] in mat
[3861799.00s] lab
[3863599.00s] oops so if I were to look at
[3866559.00s] cosine of 7
[3870720.00s] N I can see that things are kind of uh
[3875319.00s] periodic but not exactly right so you
[3878240.00s] might look at this and say okay well uh
[3881039.00s] these guys look pretty much like a
[3882279.00s] period of seven but actually here you
[3884039.00s] know you can see this stem if I were to
[3886039.00s] zoom in on this which is hard to do
[3888240.00s] actually maybe it's easier just to look
[3889200.00s] at the numbers
[3896039.00s] right so there is no like exact repeat
[3899599.00s] here you know these guys here sure they
[3902520.00s] happen to coincide but then I've got
[3904559.00s] this number and this number don't match
[3906480.00s] right these are just these are numbers
[3908000.00s] that are kind of not ever going to sync
[3910079.00s] up into a period right so that means
[3912480.00s] that we care about very
[3915160.00s] particular uh you know we care about
[3917319.00s] very particular cosiness that are
[3919680.00s] periodic in discreet time world right
[3922000.00s] we're going to talk about a lot about
[3923039.00s] that when we talk about the fouryear
[3924160.00s] transform and the fouryear series for um
[3927160.00s] digital
[3928720.00s] signals okay so that's where I wanted to
[3931559.00s] get to today any comments or
[3936440.00s] questions all right so in that case
[3940520.00s] uh hold on
