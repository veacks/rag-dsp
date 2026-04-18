# YouTube Transcript

- URL: https://www.youtube.com/watch?v=tMV61BZCrhk
- Video ID: tMV61BZCrhk
- Segments: 1000

## Transcript ([Applause])

[740.00s] [Applause]
[3770.00s] well let me start by expressing my
[7099.00s] delight at being here and telling you
[11099.00s] about wavelets but to be here for the
[14219.00s] celebration of the Isle price of even a
[16830.00s] year who's an extraordinary
[18090.00s] mathematician and a wonderful person so
[21710.00s] ok so I'm going to structure this so the
[26699.00s] talk will be structured as follows I'm
[28080.00s] going to tell you in a very hands-on
[30210.00s] without formulas way what wavelets do I
[33690.00s] mean you've heard a number of versions
[35880.00s] already - the fan was right in saying
[37950.00s] that you'll hear similar things but
[40290.00s] illuminated from different angles then
[43559.00s] I'll spend a little bit about connecting
[46160.00s] the first part which has no math to the
[49770.00s] mathematical meaning of it and talk
[52140.00s] about the roots of the wave of synthesis
[55140.00s] that happened in the 1980s from a whole
[58109.00s] lot of different disciplines and then if
[59940.00s] I have time I will talk about a little
[62370.00s] application of that might be a little
[65729.00s] bit beyond the more usual image analysis
[69630.00s] applications ok so we're going to
[73710.00s] analyze we're going to decompose images
[76049.00s] into wavelets so digital images consist
[80400.00s] of pixels and typically if you have
[82740.00s] what's called an 8-bit image what that
[84420.00s] means is that you have squares that are
[88670.00s] indexed by 256 gray levels going from 0
[93780.00s] for all black to 255 for all white and
[97409.00s] so except for those two extremes all 254
[100829.00s] in between are the different levels of
[103890.00s] gray that we have unlike the 50 that
[106110.00s] some other people may have so let's see
[112170.00s] it here this is a high-resolution
[115670.00s] digitized version of a self-portrait 500
[119820.00s] I will illustrate everything which is
[121950.00s] black and white images of course images
[124619.00s] have color but you can imagine doing the
[126719.00s] same in red green and blue which is fine
[129810.00s] but in fact for color images people use
[132390.00s] a slightly more sophisticated
[133810.00s] that scheme to compress them optimally
[135610.00s] and I won't go into that but morally you
[140200.00s] can just think of black-and-white images
[142270.00s] so if I enlarge this this little square
[145569.00s] and enlarge it even more you start
[147550.00s] seeing the individual pixels the little
[149530.00s] constant gray levels I have taken here
[152620.00s] one row out of it and that gives you
[156670.00s] these numbers out of that tiny little
[159220.00s] square and I'm going to even take fewer
[162160.00s] of those just half that row and to
[165700.00s] remind myself that those lower numbers
[168190.00s] correspond to darker Gray's I put those
[171940.00s] in bold so we're now going to do some
[174940.00s] manipulations on those numbers once you
[177610.00s] put things into numbers you can compute
[180069.00s] with them you can compute averages you
[182140.00s] can can compare them you can Swan and so
[185590.00s] that's what what what what we do in
[188440.00s] digital image processing so here is my
[191709.00s] row the first thing that's very striking
[194920.00s] is that many of these numbers are very
[196810.00s] similar so it's obvious that we can
[202540.00s] compress that information one an easy
[205150.00s] way to do that is just to take them in
[207010.00s] blocks of two and compute the average
[208510.00s] for every pair and still we have many
[211840.00s] numbers that are similar so we could do
[213519.00s] that again
[213970.00s] of course every time we replace a pair
[216819.00s] of numbers by their average we lose the
[218920.00s] information about the difference between
[220420.00s] the two numbers so we that's these red
[223660.00s] numbers here and the next level those
[225880.00s] red numbers if you know from two of two
[229329.00s] numbers they're average and their
[230950.00s] difference you can go back so from these
[233859.00s] black numbers and these red numbers I
[236019.00s] could go back to these black numbers and
[238829.00s] taking information and those red ones I
[241239.00s] could go back to the originals so for
[242709.00s] the moment I have just translated the
[245109.00s] information into a different way of
[247660.00s] looking at it but I could go always go
[249340.00s] back but the interesting thing is that
[251530.00s] we find that many of these numbers these
[253480.00s] differences are fairly small
[256209.00s] remember those differences could go from
[258370.00s] negative 255 to 255 and most of those
[261729.00s] numbers have just are smaller than 10 in
[264280.00s] absolute value
[266030.00s] so we're they're not small is where
[269690.00s] something is really happening in the
[271400.00s] image so the image itself that was the
[274370.00s] day that themselves tell us where we
[276349.00s] need large numbers in these red arrays
[278620.00s] which is an interesting thing that's
[280699.00s] happening here
[282470.00s] you could then imagine sorry you could
[286310.00s] imagine just putting the other numbers
[289520.00s] to zero and going back sorry the other
[293360.00s] number is going to zero and going back
[295159.00s] and you would get something that's very
[296990.00s] close to the original but before we even
[299780.00s] start doing that let's remember that
[301879.00s] images really are two-dimensional so you
[304729.00s] have pixels in both directions so if I
[307639.00s] take a little square here then I have
[311629.00s] really an array horizontally and
[314210.00s] vertically and we saw already in in
[317090.00s] Stefan's talk that what you have to do
[319219.00s] then is you have to the kind of
[320719.00s] transform that you would do in one
[322129.00s] direction you have to do in both so
[325690.00s] we'll take those numbers and take their
[328909.00s] averages yeah Here I am aware I assure
[333380.00s] you I'm aware now that the average of
[335870.00s] 121 and 122 is not 120 point five but
[339590.00s] after I'd made that mistake and I know
[341509.00s] this is the first time I went through
[342830.00s] your slides that I've made it I decided
[344960.00s] let me just leave it in because I mean
[348130.00s] mathematicians are not the people who
[349909.00s] are the best at balancing their
[351740.00s] checkbooks okay
[355699.00s] so I have those averages and I'll do
[358969.00s] that I mean so I did it here on that
[362000.00s] first row but I can do it for this pair
[366289.00s] also and then for this role I mean row
[368210.00s] by row and I get all these leverages and
[371539.00s] so I now have these two arrays
[373400.00s] corresponding to horizontal averages and
[375800.00s] horizontal differences and now I have to
[377930.00s] do the same thing vertically so on each
[381020.00s] of these I'll have to do the same thing
[382969.00s] so I do it on the averages vertically
[387289.00s] that gives me an average and a
[389960.00s] difference and I'll do it on this red
[391759.00s] array of horizontal differences and I
[393620.00s] get these two numbers so I get four
[396589.00s] types of numbers
[397810.00s] and that corresponds to one number here
[401230.00s] that's an average involved direction and
[405130.00s] the other three correspond to the three
[407050.00s] wavelets that Stefan mala already
[409060.00s] Illustrated so I have to now what do
[413590.00s] large numbers stand for
[415330.00s] I mean before when I had in one
[417700.00s] direction a large number corresponding
[419620.00s] to a big shift but now I have three
[422020.00s] species of differences
[423669.00s] what do large numbers stand for well if
[425919.00s] you mentioned in your image big
[428590.00s] horizontal dark alternating dark and
[431230.00s] light stripes then those would survive
[434340.00s] horizontal differencing you would get
[436300.00s] low numbers and then high numbers and
[438760.00s] low and high and after you run different
[442270.00s] vertically you would find large numbers
[444310.00s] so large numbers in this array
[446550.00s] corresponds to finding this kind of
[448900.00s] feature difference is here if you
[451150.00s] imagine vertical stripes low high low
[454800.00s] high then if you take differences
[457810.00s] horizontally you will find large
[460030.00s] differences as you cross these
[461740.00s] boundaries and you will find the same
[463660.00s] difference here as I find there and so
[466390.00s] when you average vertically you
[467890.00s] reproduce that and you find these large
[469990.00s] numbers so large numbers here correspond
[472419.00s] to finding this and then this
[474100.00s] corresponds to finding something that is
[476140.00s] is oblique I mean and like on a
[478750.00s] checkerboard it could be oblique in one
[480400.00s] or the other direction so but not only
[484330.00s] will I find these kind of features I
[486010.00s] also will just like in one dimension I
[488050.00s] will repeat the same operations at lower
[490840.00s] levels and so I on these averages I will
[496390.00s] do the same thing again
[497680.00s] I'll take average in both Direction
[500620.00s] average differencing difference of
[501910.00s] ordering and both differences and so I
[504580.00s] have from my original array I have
[507250.00s] simplified it to its global average of
[510970.00s] these in these 16 I find one and these
[513909.00s] difference numbers okay so let's see
[517750.00s] what that does on a full image too just
[519880.00s] so I have this full image and if I
[522940.00s] average in both directions then I will
[526089.00s] find something that where the original
[528160.00s] dark will be dark again where the
[529990.00s] original was light it will be large
[531279.00s] again
[531759.00s] so in fact I what I get is a smaller
[533620.00s] version of the original image now I had
[538269.00s] this convention that zero was all black
[541060.00s] white was 255 now that I've started to
[544600.00s] take differences I will have numbers
[546790.00s] from negative 255 to 255 how I'm going
[550509.00s] to represent those well I still I'm
[552370.00s] going to represent as an image and so
[554350.00s] the convention is that the middle of
[557230.00s] that is something where we which is zero
[559959.00s] is where we would middle gray and so
[563079.00s] when things are large positive or large
[566350.00s] negative that's why we will find the
[567939.00s] black and whites and so that is what I
[570430.00s] see here if I render that information
[573759.00s] and you see here that I indeed I find
[576670.00s] large numbers where I find vertical
[579639.00s] features in my image because I have
[583529.00s] difference horizontally and averaged
[587350.00s] vertically vertical features will stand
[590410.00s] out okay now here after difference
[594610.00s] vertically and I can do that by
[597399.00s] averaging horizontally of differencing
[598899.00s] vertically and I get these two I get
[600610.00s] horizontal features and oblique features
[603189.00s] but almost everything is middle gray
[607329.00s] that's this very interesting thing the
[609699.00s] numbers are very small almost everywhere
[612720.00s] for a different image the numbers would
[615970.00s] still be very small almost everywhere
[618009.00s] except where they're large would be
[620470.00s] different places so you don't know ahead
[622509.00s] of time for images where you have the
[625240.00s] large numbers but in practice you always
[627939.00s] have a very few large numbers when you
[630279.00s] do this transform okay so we have to do
[634000.00s] it that next scale this will give an
[636250.00s] average that is a smaller version and it
[638649.00s] will give these three differences and
[640740.00s] then I have to add in the information
[643269.00s] that I had before and so this full array
[646389.00s] on the right gives me still the same
[648579.00s] information as I had on the left I can
[650439.00s] always go back and I'll do it again
[654170.00s] and Adhan and again and add it in and
[659430.00s] again and I did it
[661500.00s] oops I lost an image there ah there it
[665310.00s] is
[665610.00s] sorry okay so I can still go back now
[671310.00s] what's the use of that you would say I
[673620.00s] mean I did at least image on the right
[676050.00s] on the left look nicer than then this is
[678150.00s] nonsense on the right well of course you
[680730.00s] don't just want to do the transform you
[682740.00s] want to do things with it but before we
[685260.00s] do that let's try to understand the
[687150.00s] transform a little better so I can go
[692220.00s] back always
[693330.00s] so let's try to go back but not take the
[696210.00s] full information let's take the
[697980.00s] information only of the top left here if
[700350.00s] I then go back I find this on the left
[704310.00s] if I take this this corner this top
[706380.00s] corner thing here now here you can see
[710760.00s] that I have swept something under the
[712470.00s] rug because if I were truly doing what I
[716970.00s] was saying namely taking averages two by
[719820.00s] two and so on then when I go back and
[722160.00s] forgetting about the differences I would
[723930.00s] get blocks that are 32 by 32 a constant
[727500.00s] gray level and that's not what I'm
[729510.00s] having and that's because what I did was
[732360.00s] I took slightly more sophisticated
[733830.00s] averages and differences that correspond
[736140.00s] to wavelets that have better regularity
[739500.00s] the ones that's the fun described but
[742380.00s] and these are the ones that are used in
[744240.00s] the JPEG 2000 standard and the result of
[746790.00s] that is that this is not the blocky
[750270.00s] 32 by 32 blocks that you would get from
[752790.00s] just averaging and different thing but
[754380.00s] nicer but it has as little information
[756450.00s] as that and then let me add in gradually
[759780.00s] the detail and you get the
[762930.00s] reconstruction so you see that you get
[765030.00s] gradually a finer and finer resolution
[767640.00s] version so let's look at that in two
[772890.00s] different parts of the image let's look
[775230.00s] here I have two parts I have a part in
[777840.00s] the sky and I have a part in the sail ok
[782760.00s] let's first look at the other patch
[784980.00s] sale and so I'm just doing what I did
[788459.00s] before reconstructing adding more and
[791490.00s] more detail that you'll see on the right
[792930.00s] and you can compare on the left with
[794399.00s] what the original was I add at and you
[797790.00s] see I need all the levels of detail to
[801329.00s] really get a perfect version but let's
[804060.00s] now look at the sky so this is again
[807779.00s] very coarse and probably people at the
[810389.00s] front see a slight difference let me go
[812779.00s] front back and forth a little bit
[824270.00s] look just at the sky you see a slight
[827270.00s] difference but at this level you don't
[830690.00s] see a difference anymore I mean so in
[833180.00s] the sky I don't need all that full
[835130.00s] detail in order to get more information
[838030.00s] so I can use this also we'll come back
[844100.00s] to what you just saw I can use also this
[846260.00s] also for compression okay we have the
[852410.00s] image on the left now as we've
[855050.00s] understood it we can see how compression
[857090.00s] will work if I reconstruct if I take
[861050.00s] only the coefficients that are large on
[863780.00s] the right which I call a red here on the
[865790.00s] right and I reconstruct I get the image
[868220.00s] on the left and you see it's not a
[869600.00s] perfect reconstruction if I toggle back
[871640.00s] and forth you see it's not perfect but
[875690.00s] if I take a few more the ones like color
[880700.00s] green here also the image is perfect but
[883610.00s] only 10% so only one out of every 30 so
[890240.00s] here actually sorry here I was having
[892610.00s] three four and three percent so it's
[894530.00s] only about one in 30 of the information
[896810.00s] so that's like having one pixel for
[899720.00s] every block of two by two pixels before
[904130.00s] one one bit for every block of two by
[906170.00s] two pixels because before every pixel
[908630.00s] had eight bits and but nevertheless I
[911690.00s] get a fairly good very good version of
[915680.00s] the image and here I get a perfect
[917720.00s] version so you can actually the
[922340.00s] localization the whole transform was
[924950.00s] nicely localized and we can you imagine
[926780.00s] using that for an application in which I
[930170.00s] would first look at a very coarse
[932420.00s] version a thumbnail of my image identify
[935720.00s] which area I want you could imagine
[937430.00s] trying to retrieve medical images from a
[940550.00s] library that has them at high resolution
[942530.00s] but on over a slow pipeline and not
[945620.00s] wanting to spend the minute sitting
[947840.00s] every time to load up the image you
[949730.00s] could say no I don't want that full
[951650.00s] thing I only want to look at this area
[953390.00s] and then you send that information
[956300.00s] the database uses that to color in red
[959030.00s] what you want and as I add that
[962000.00s] information I can build up the high
[965570.00s] resolution for that and not waste
[968590.00s] pipeline bandwidth on the rest so okay
[973580.00s] so we've looked at the algorithm and
[975470.00s] we've understood what the algorithm does
[977540.00s] what the numbers stand for and how that
[980300.00s] can be useful for compression and
[981920.00s] localization so the one of the very
[985730.00s] first applications for which wavelets
[989030.00s] were used in compression or for
[991460.00s] compression of fingerprints this was
[992810.00s] even before the jpeg 2000 standard was
[995180.00s] formulated but it uses the same wavelets
[997550.00s] and so here you have a fingerprint if
[1000850.00s] you zoom in then you see that the
[1003550.00s] fingerprint it has the lines we're all
[1005860.00s] familiar with but it also has these
[1008320.00s] sweat pores in it and it turns out that
[1010990.00s] the algorithms to recognize fingerprints
[1013390.00s] or to identify that one fingerprint is
[1015970.00s] similar to another use not only the
[1018460.00s] information on the location of those
[1020740.00s] lines but they also use location of
[1022750.00s] smaller islands and even of those sweat
[1025750.00s] pores so you have information many
[1028570.00s] different scales there and so that's the
[1031060.00s] reason why when ditch the algorithm was
[1034540.00s] searched for to compress data prints
[1037150.00s] from the digitization of the whole the
[1039940.00s] whole collection on on cards to to to
[1045240.00s] digital files it turned out that the
[1050370.00s] wavelet compression did a good job I
[1054010.00s] mean you see it's not perfect but it is
[1057130.00s] pretty good you see that Island you see
[1058930.00s] the pores while the Dan in the the the
[1062890.00s] the the JPEG algorithm that was used at
[1065830.00s] that time did a much a much worse job so
[1069910.00s] that's that very first application so
[1072400.00s] let's now think about what we've seen
[1075580.00s] this localization the compression and
[1078610.00s] think about what it means mathematically
[1080250.00s] so what we started with I mean if you
[1083920.00s] have an image you can imagine it as
[1086530.00s] smooth parts and
[1088039.00s] sudden transitions so let's do it in 1d
[1090710.00s] even though images are 2d you had a
[1093169.00s] function f we first digitized it so that
[1095869.00s] means that we take a very very fine
[1097759.00s] scale approximation to begin with and
[1101509.00s] then we be thinking about that fine
[1104149.00s] scale approximation for the moment so
[1106999.00s] what we did in that fine scale
[1108559.00s] approximation was we replaced every two
[1111679.00s] levels by their average and then that's
[1116899.00s] how we found a coarser approximation and
[1119830.00s] then in that coarse approximation we
[1122509.00s] again took pairs of levels and replace
[1124970.00s] them by the average and that's an even
[1128809.00s] coarser and we did that again so in each
[1133729.00s] of those successive approximation we
[1135499.00s] lost some detail what was the detail
[1137299.00s] well you just take the difference of the
[1138679.00s] two functions and that's what you see
[1141320.00s] here indicated in a couple of spots now
[1144799.00s] the difference of the two functions is
[1148039.00s] really these red functions I mean if you
[1152720.00s] add to the lighter blue on this thing
[1154789.00s] then you get a darker blue and in the
[1157070.00s] older spaces so those differences are
[1159499.00s] those and if you did it everywhere not
[1161330.00s] just those three special spots you would
[1163429.00s] get this so that's the difference
[1165889.00s] between two successive approximations at
[1171049.00s] the next level we did the same thing so
[1172940.00s] again I can look at those differences
[1174499.00s] and that would be the difference
[1177559.00s] function and again and that's the
[1180320.00s] difference function so I had these three
[1183889.00s] different different functions and what
[1187129.00s] they correspond to is all copies of that
[1193279.00s] little building block that you already
[1195440.00s] encountered in in Stefan's talk which is
[1198229.00s] the haar wavelet but dilated at
[1200989.00s] different scales so we can write all
[1205220.00s] those different functions as copies of
[1210549.00s] different scaled versions of that haar
[1213710.00s] wavelet put in different places and so
[1217460.00s] if we add all those up
[1220940.00s] then you see if I add these three things
[1226340.00s] up the intermediate terms will cancel
[1228320.00s] out and I'll get a difference between
[1230690.00s] the first 1 and 1 3 times later if I do
[1233750.00s] that many times
[1234980.00s] I'll get that my original 1 is 1
[1240950.00s] many many many levels later and a whole
[1243650.00s] lot of these differences and each of
[1245180.00s] those differences I can write as an
[1247340.00s] expansion in into these high wavelets uh
[1250240.00s] and then we're mathematicians now I mean
[1254450.00s] we can think of taking limits I mean and
[1257270.00s] so if we approximate if we start from
[1259280.00s] our image and digitize it finer finer
[1261350.00s] finer finer that means that we let J tan
[1263150.00s] to infinity then PJF goes to F we lose
[1267530.00s] nothing in the digitisation in the limit
[1269720.00s] on the other hand if we take more and
[1272000.00s] more steps so that here we take average
[1274340.00s] of a wide wide wide wide ranges well I
[1277100.00s] mean if you have a function that's
[1278750.00s] living here and you take its average
[1280370.00s] over that it kind of vanishes away so
[1283100.00s] that will go to zero and so you find
[1285620.00s] that in F itself will be a linear
[1289190.00s] combination of these functions and the
[1291380.00s] functions that we looked at I mean this
[1293600.00s] is these type of stop functions are
[1296480.00s] mutually orthogonal because this one is
[1298640.00s] are talking to its translate and then
[1300220.00s] this one is orthogonal to the one that's
[1302870.00s] twice is right because there the other
[1304370.00s] one is constant and the integral of the
[1305960.00s] thing is zero so you have an orthonormal
[1309140.00s] basis now I did it with the HAR basis I
[1315920.00s] told you that in practice we do averages
[1318530.00s] and differencing over which are more
[1321890.00s] generalized we use more than just two
[1324940.00s] coefficients we correct with neighboring
[1327500.00s] coefficients to get a higher scheme
[1329060.00s] order approximation scheme and a higher
[1332450.00s] order approximation scheme and so we get
[1334400.00s] smoother waveless but the principle is
[1336590.00s] still the same you still if you work at
[1339530.00s] a building your filters correctly get an
[1342230.00s] orthonormal basis and you still will
[1344060.00s] have a decomposition the decomposition
[1349760.00s] that you have is
[1352490.00s] what's called an unconditional basis for
[1355760.00s] a whole lot of function spaces and
[1357410.00s] that's really the power and that is
[1359660.00s] something that could only be understood
[1361420.00s] when the synthesis was made between this
[1364940.00s] way of operating and a harmonic analysis
[1368270.00s] which is really the the pivotal role
[1370910.00s] that even a year played I mean there was
[1373640.00s] a whole tradition in harmonic analysis
[1375650.00s] that actually gave insight in what's
[1379430.00s] going on here and that gives the
[1380930.00s] mathematical power behind the wavelets
[1382850.00s] so let me explain you a little bit what
[1385700.00s] what what that means what does it mean
[1388190.00s] to be an unconditional basis for a space
[1391130.00s] fee what it means okay so you can do for
[1397160.00s] fairly general F so you can decompose
[1400640.00s] into that basis so they can be very
[1402680.00s] general objects and you decompose into
[1406430.00s] the basis then that means that you start
[1408920.00s] from F and you now get a decomposition
[1411050.00s] with coefficients and we have an
[1412730.00s] algorithm for computing them then you
[1415100.00s] want to know properties of that function
[1417590.00s] and mathematically that means that you
[1419360.00s] want to decide in what functional spaces
[1421820.00s] this function lies and well of course
[1426020.00s] since the function is given by the
[1427880.00s] decomposition the coefficients have that
[1430370.00s] information you say it's an
[1432530.00s] unconditional basis if that information
[1435710.00s] is controlled completely by the
[1439210.00s] magnitude of the coefficients and not
[1442100.00s] just by the magnitude but in a kind of
[1443810.00s] monotone way by the magnitude what that
[1447680.00s] means is is we saw that in Stefan's talk
[1450400.00s] smoothness of a function or something
[1452870.00s] that you could see from looking at the
[1455450.00s] absolute value of the wavelet
[1457190.00s] coefficients and you could make an
[1459200.00s] estimate of the smoothness by that
[1461030.00s] absolute value but in practice this has
[1464690.00s] enormous applications it means that you
[1468800.00s] can take a function decompose it into
[1473360.00s] wavelets from the coefficients you can
[1475760.00s] see what properties it has you can see
[1477920.00s] that locally remember the localization
[1479630.00s] property of the wavelets you can
[1481160.00s] characterize motions locally but
[1483460.00s] it also means since everything is going
[1485770.00s] to be monotone on those absolute values
[1487330.00s] that if coefficients are very small you
[1490029.00s] can put them to zero and nothing bad
[1492610.00s] will happen to your function and that's
[1495010.00s] the difference in many of the functional
[1496870.00s] spaces of interest with a Fourier
[1498820.00s] decomposition I mean Zygmunt
[1500890.00s] trigonometric series book has ample
[1504250.00s] examples of functions that you decompose
[1506470.00s] in trigonometric series and you then
[1510279.00s] look at the coefficients and of course
[1512590.00s] changing the phase of the coefficient
[1514570.00s] doesn't change anything to the integral
[1517090.00s] of the square of the function but if you
[1519130.00s] look at other powers or smoothness or so
[1521590.00s] on changing the space order of those
[1524919.00s] coefficients can really kind of flip you
[1527320.00s] out of the space in which you were
[1528640.00s] sitting I mean it's really or putting
[1530350.00s] some of those coefficients to zero it's
[1532539.00s] something that you do not control so
[1534549.00s] that's why for applications and
[1536590.00s] conditional bases are very very
[1539200.00s] important I mean it I had it there was a
[1542320.00s] time that I had to convince people that
[1543850.00s] this notion from the geometry of Banach
[1547059.00s] spaces was something that people in
[1548890.00s] Applied Mathematics really really should
[1550659.00s] care about because we needed to control
[1553360.00s] things okay so we've talked a little bit
[1561159.00s] about a mathematical meaning we have
[1563409.00s] seen and so on so let's talk about roots
[1565799.00s] so in the 80s wavelets happened as has
[1573760.00s] been described by both evening air and
[1576279.00s] stefan mala as a synthesis of ideas from
[1579460.00s] many different fields and the rich
[1582159.00s] mathematical tradition of harmonic
[1584500.00s] analysis played an important role in
[1586330.00s] that and as a fan said it started with
[1591039.00s] little wood Paley theory in the early
[1593169.00s] 20th century if you have a function and
[1596080.00s] you decompose it in a Fourier series and
[1598600.00s] the phase of the CNS is very important I
[1601419.00s] mean if you change the phase by
[1604929.00s] multiplying each of these coefficients
[1606600.00s] by some arbitrary phase so it depends on
[1610600.00s] and different phases for different and
[1612370.00s] then the properties of that of that new
[1615130.00s] function may be completely different
[1617650.00s] for instance you could be in a certain
[1620500.00s] smoothness space and because you change
[1622690.00s] the phases all of a sudden no longer be
[1624429.00s] in that smoothness space little bit
[1628630.00s] Bailey
[1629409.00s] analysis regroups the coefficients into
[1633190.00s] dyadic blocks so you take the first
[1635799.00s] coefficients than a little block and
[1637960.00s] then the next block and then a bigger
[1639880.00s] block and so on so you group them
[1641529.00s] together in in these blocks you still
[1644200.00s] have some arbitrary I mean look we have
[1646929.00s] here this this sorry you still have here
[1653169.00s] there's some over L so these things
[1656320.00s] we've grouped together coefficients but
[1658659.00s] we still can now change an arbitrary
[1661360.00s] phase in each of these blocks and let
[1663970.00s] what Bailey analysis tells you that that
[1666820.00s] doesn't matter I mean for instance if
[1669309.00s] you look at smooth two spaces changing
[1671380.00s] those phases doesn't flip your leg and
[1674559.00s] squeeze you out like the base the
[1677080.00s] toothpaste of tube I mean doesn't happen
[1679299.00s] anymore you don't flip to some other
[1681490.00s] universe so little would Bailey theory
[1686500.00s] is what what is embodied in with much
[1690010.00s] more richness in Calderon Zigman theory
[1692080.00s] and that's the framework where even a
[1695169.00s] year constructed his rate basis but he
[1697870.00s] constructed it will will come back it
[1699640.00s] will seen a little bit about the
[1702549.00s] windowed Fourier transform which has
[1704140.00s] been also featured in emails talk as
[1707500.00s] time frequency wave loads for the
[1711279.00s] windowed Fourier transform we knew there
[1714700.00s] was no such alternative basis so people
[1718470.00s] came from the algorithmic part from the
[1720970.00s] applied part kind of implicitly assumed
[1723580.00s] there would be no such basis for the the
[1727330.00s] wavelet situation and then give me a
[1730870.00s] constructed one I was really like a
[1732820.00s] thunderbolt out of blue sky I mean what
[1735399.00s] and then it later turned out that there
[1739210.00s] had been an earlier construction but the
[1741669.00s] by analyst ROM work but nobody at least
[1745720.00s] to my knowledge had realized that this
[1748659.00s] was generated by
[1751090.00s] and translates of just a single function
[1753100.00s] that feature had not been emphasized and
[1756330.00s] certainly people who were working on the
[1758650.00s] wavelet applications had didn't know
[1760960.00s] anything about this okay so that was one
[1764230.00s] route just a little bit and there I mean
[1766870.00s] there was a whole rich tradition of
[1769590.00s] wonderful very strong theorems that gave
[1772330.00s] you insight and singular integral
[1774670.00s] operators and so on that used these
[1777190.00s] dilations and translations but as was
[1781780.00s] already mentioned the name wavelets
[1783670.00s] actually didn't even it came from a
[1785560.00s] completely different route namely
[1787420.00s] seismic exploration so in seismic
[1790030.00s] exploration you sent waves down and they
[1794980.00s] get reflected of the interface of
[1797230.00s] different layers and things come back
[1799540.00s] and so you MIT as of T and you get back
[1804760.00s] distorted reflections many of them and
[1807060.00s] what you want to reconstruct is where
[1810430.00s] those layers are what happens is that in
[1813730.00s] these reflections you have a whole set
[1816970.00s] of frequencies and different frequency
[1818860.00s] components will travel at different
[1820210.00s] speeds in the in the layers when they
[1823360.00s] come back and so by decomposing the the
[1828330.00s] reflections into their time because that
[1832210.00s] tells you when different things arrive
[1834130.00s] but also in frequency you get
[1836350.00s] information about how deep that travels
[1838990.00s] and so people in seismic analysis use
[1842770.00s] sophisticated algorithms to extract them
[1845500.00s] from all these decomposition like that
[1849360.00s] information about the layers underneath
[1851410.00s] and time frequency decomposition helps
[1854710.00s] sort out so time and frequency those
[1857230.00s] different reflections from Oakland who
[1859750.00s] worked at alpha t10 had proposed a
[1862120.00s] different transform because he wanted to
[1863980.00s] to zoom in the zoom in property that you
[1866770.00s] saw and safe and my last talk he wanted
[1868690.00s] to get better resolution at very high
[1870460.00s] frequencies and but he had proposes
[1874270.00s] transform it was an algorithm he didn't
[1876340.00s] have underlying mathematics and there
[1878410.00s] was a lot of skepticism within his
[1879970.00s] community but the name wave that comes
[1882160.00s] from there because what what people did
[1884020.00s] in
[1884650.00s] in seismic research was to do the time
[1888940.00s] frequency analysis they would make a
[1891790.00s] windowed Fourier transform them would
[1893500.00s] window the function and then modulate
[1896770.00s] that and that was were than different
[1899590.00s] choices of window correspond to
[1901059.00s] different wavelets they were waves but
[1903880.00s] window so small waves and they were
[1907240.00s] called wavelets in English and all the
[1908770.00s] let in in so on and they had you
[1910600.00s] typically the name of the person who had
[1912550.00s] proposed you had the wavelet of Claude
[1914020.00s] or you had to wavelet of X and of Y and
[1916410.00s] normally proposed wavelets of constant
[1919179.00s] shape will see those in a second and so
[1922420.00s] that's once we get out of size mix we
[1925120.00s] didn't know the term Wedgwood so we
[1926770.00s] didn't think of calling it wavelets of
[1928690.00s] constant shape all the time I became
[1929950.00s] wavelets and people in seismics were
[1932080.00s] very annoyed when the Newton
[1933880.00s] mathematical developments came back to
[1935350.00s] their field and they saw that their term
[1937059.00s] had been purloined okay quantum
[1941230.00s] mechanics this is where alex kurtzman
[1943300.00s] was working so in quantum mechanics the
[1946000.00s] physical state of a system is presented
[1949420.00s] by a wave function so the X in that wave
[1952690.00s] function is position is a Schrodinger
[1954610.00s] representation if you take its Fourier
[1957280.00s] transform then the variable becomes is
[1960670.00s] interpreted as momentum so if so I had a
[1964270.00s] size large in some places then that
[1966070.00s] means there's a lot of momentum at that
[1967809.00s] value X i if it's small elsewhere that
[1970240.00s] means it's very little momentum of that
[1973059.00s] different value if you want to localize
[1976510.00s] in both then what you do is you first
[1981630.00s] localize it so you take a function a
[1984429.00s] nice window something that localizes
[1987280.00s] around 0 you move it to the right place
[1989890.00s] to Q and you multiply by that and then
[1993520.00s] you take the Fourier transform of the
[1995020.00s] results so what you've done is then
[1997150.00s] you've taken an inner product with a
[1999370.00s] function is labeled by both Q and P and
[2002000.00s] it corresponds to you see you have the
[2004679.00s] localization here the number of
[2008910.00s] oscillations corresponds to P so here's
[2011040.00s] a different one with the lower value of
[2012570.00s] B
[2014720.00s] so what Ramallah did was saying look
[2018680.00s] let's take one of these functions and in
[2020390.00s] order to get to higher frequencies
[2022400.00s] instead of taking the envelope and
[2025010.00s] filling with more and so on he said
[2027230.00s] let's just take one of these and squeeze
[2032000.00s] it like here so that's how you get
[2036680.00s] higher frequency now in quantum
[2039260.00s] mechanics we had this had been proposed
[2041900.00s] independently by jean-claude ER to solve
[2046550.00s] to study a gravitational problem in fact
[2049160.00s] and Alex Grossman and Thierry pol
[2052330.00s] studied this the mathematics of this
[2054860.00s] transform where you translate but
[2057860.00s] squeezed and so provided a mathematical
[2061760.00s] basis for all the stuff that your mala
[2063500.00s] had been doing which Rama Louis was
[2065720.00s] extremely pleased by because now he
[2067400.00s] could go back to his colleagues and say
[2069110.00s] look it has a mathematical foundation I
[2071179.00s] mean this is not something that I just
[2073000.00s] invented out of thin air and that you
[2075260.00s] didn't believe in okay so that was the
[2079550.00s] route in in in quantum mechanics and so
[2082640.00s] when I was saying that the basis of
[2084290.00s] evening air was a big surprise it's
[2086450.00s] because in this setting we know that you
[2091100.00s] couldn't find an orthonormal basis that
[2093440.00s] had good localization and good
[2095950.00s] smoothness and so we assumed it would be
[2099980.00s] the case also here without proof we
[2102860.00s] didn't even realize that we want to
[2104930.00s] prove this and we kind of just assumed
[2109100.00s] it and with them even yeah as I said it
[2111770.00s] was a bolt out of blue sky okay another
[2116690.00s] route in computer vision and stefan mala
[2119840.00s] alluded to that too in a visual scene
[2122600.00s] information exists at many scales and
[2127060.00s] how you can you try to disentangle them
[2129710.00s] so let's imagine this caking the thing
[2132230.00s] and blurring it making it more and more
[2134990.00s] blurry and then look at the differences
[2136610.00s] and I have here an example I mean so
[2140780.00s] again you should imagine it doing it
[2143090.00s] doing it everywhere but suppose I take
[2144890.00s] this which is a high-resolution
[2146680.00s] another painting by Van Gogh and I have
[2149710.00s] enlarged it here
[2150850.00s] so imagine blurring this many times and
[2155770.00s] you see it becomes blurry and blurrier
[2158130.00s] then I have of course difference between
[2161650.00s] them and I have here the colours on the
[2163930.00s] right is just false colour in order to
[2166090.00s] make clear what's happening and I've got
[2170590.00s] a difference again a difference and so
[2173380.00s] you can look at these differences in
[2176770.00s] order to get information about what was
[2178720.00s] there you can look at for instance the
[2181750.00s] fact that there is a edge in the
[2184600.00s] original clog is something that you see
[2187210.00s] by seeing that edge at all scales but
[2190120.00s] there are other things too I mean if I
[2191920.00s] look here for instance then you see that
[2194650.00s] things emerge at certain scales and
[2197200.00s] disappear again so this idea of detail
[2202720.00s] at different scales existing by
[2204550.00s] despairing blurs is something that was
[2207160.00s] an ideal living already in the computer
[2209350.00s] vision world and that was embodied but
[2214180.00s] in a very nice and elegant way by multi
[2216640.00s] solution Alice's and away votes computer
[2220630.00s] graphics is another route okay let me
[2223600.00s] try to illustrate that it's imagine that
[2226390.00s] I give you points as well imagine I put
[2228840.00s] points down on a paper and I say look
[2231160.00s] these points successively put down are
[2233620.00s] going to determine a curve so okay I'm
[2237700.00s] going round and round
[2239500.00s] oops what's happening here I'm going
[2241750.00s] back okay so what I did really has I had
[2246220.00s] that girl so how would you from those
[2250750.00s] points draw that curve well if you did
[2253450.00s] it yourself and you found those points
[2255130.00s] what you would do is you would try to
[2256300.00s] put guest points in middle and that's
[2258220.00s] exactly what computer graphics
[2260770.00s] algorithms would do they would say let's
[2262930.00s] take the x-coordinate of those points
[2264910.00s] take all these x coordinates for the
[2267640.00s] first second third and so on and then
[2270010.00s] you would try to guess a point in the
[2272110.00s] middle by taking some weighted average
[2275140.00s] of neighbors and what you're doing here
[2277780.00s] is an algorithm
[2279680.00s] I mean and you do this for x and
[2281150.00s] y-coordinates and so on it's an
[2283130.00s] algorithm that's very similar to the
[2284930.00s] algorithms that Stefan was showing us
[2287480.00s] earlier and in which in which you do a
[2291680.00s] convolution you look at neighbors it put
[2294380.00s] weights on them so that's the convolving
[2296810.00s] and you do that everywhere and that's
[2299000.00s] what makes the whole thing the convolved
[2300680.00s] sequence and so the algorithms used in
[2305240.00s] computer graphics were algorithms that
[2307670.00s] were like the reconstruction waves or in
[2309860.00s] wavelet theory and so the analysis
[2314840.00s] trying to analyze how smooth the
[2317210.00s] functions are if you try to reconstruct
[2319640.00s] with certain filters is something that
[2322130.00s] was a similar question to a prop
[2325160.00s] mathematical problems in computer
[2326540.00s] graphics
[2329860.00s] there's also a root in my list original
[2332900.00s] list of roots I listed electrical
[2334340.00s] engineering
[2334940.00s] I'm not going to illustrate that further
[2336590.00s] here because we already saw a lot of
[2338540.00s] those diagrams which convolving with
[2340820.00s] filters F and G and then down sampling
[2343310.00s] and then up sampling and so on those are
[2345260.00s] typical diagrams you would see from
[2347210.00s] signal analysis in electrical
[2348770.00s] engineering so there were all these
[2350720.00s] different roots there were the synthesis
[2352700.00s] that were made in all these different of
[2354590.00s] all these different fields but then the
[2356480.00s] synthesis connected via Eve Mayer with
[2359420.00s] this large tradition in harmonic
[2361460.00s] analysis which gave us a foundation for
[2367400.00s] why was this working so well why was it
[2369710.00s] capturing why could we put coefficients
[2373010.00s] to 0 and we were still capturing all the
[2375740.00s] essential features in in in in in the
[2377900.00s] images why I mean so all of a sudden we
[2380450.00s] understood much more about the
[2381770.00s] mathematics in Reverse once you had
[2384560.00s] wavelets orthonormal functions after
[2387200.00s] normal a basis of wavelets it turned out
[2389270.00s] that some arguments in in harmonic
[2392900.00s] analysis became easier to prove because
[2394940.00s] you first spent effort improving your
[2397040.00s] normal basis and then you already knew
[2398810.00s] that and you could just translate
[2400280.00s] everything and make estimates more
[2402290.00s] easily people had with great ingenuity
[2407780.00s] already proved most of the theorems that
[2409820.00s] you could prove with wavelets but I mean
[2412250.00s] wait
[2412600.00s] the proofs did become easier I mean at
[2414730.00s] least in my humble opinion and it also I
[2421450.00s] mean waves gave the day by now I mean
[2424900.00s] somebody asked me yesterday said I heard
[2427200.00s] twenty years ago I heard a lot going on
[2429970.00s] about wavelets and I don't hear so much
[2431680.00s] anymore well first of all that some of
[2434500.00s] it was hype
[2435220.00s] I mean if once you have a new hammer you
[2438460.00s] think everything is a nail and and some
[2441490.00s] nails are really screws and so you
[2443560.00s] shouldn't hammer those of your destroy
[2445300.00s] the screw but on the other hand when you
[2449710.00s] use your hammer and things that are
[2450940.00s] truly nails then it becomes a very
[2453850.00s] useful tool and so people start who want
[2456010.00s] to have those kind of nails learn to use
[2458140.00s] your hammer and it becomes part of what
[2460420.00s] is established and you use it and so
[2462550.00s] they have in the applications where
[2464680.00s] they're really useful they have just
[2465820.00s] become incorporated in in in what we
[2468280.00s] know and love to do and and and that's
[2471430.00s] how you use them and I do have time so I
[2475720.00s] can tell you about an application that
[2479020.00s] is a better further afield in the last
[2481660.00s] 10 years or so through complete accident
[2484990.00s] I became I came in contact with people
[2488230.00s] in art conservation and art history and
[2491020.00s] they have first of all they're beautiful
[2494410.00s] images this is so much more interested
[2496990.00s] in than I mean sorry this is am better
[2500110.00s] than Elena I mean so but they also have
[2508060.00s] interesting questions I mean that it
[2511240.00s] turns out require sometimes they require
[2515920.00s] just us thinking about how can we use
[2518740.00s] what we've understood already in these
[2520630.00s] settings but sometimes they become
[2522220.00s] research questions and so they become
[2524320.00s] part of new PhD theses and new papers
[2528970.00s] okay so this is I have a whole slew of
[2531730.00s] those but I have only two point forty
[2534310.00s] eight minutes left so let me show you
[2537190.00s] just one this is a very very very famous
[2539890.00s] painting in Belgium which is called the
[2543450.00s] the Ghent Altarpiece the lamotte's the
[2547530.00s] adoration of the mystic lamb also by
[2549630.00s] young phonic it was incredibly
[2551730.00s] influential in its time because it was
[2553770.00s] one of the first really large scale and
[2558870.00s] beautiful detailed pieces in oils and so
[2563130.00s] you can actually art historians find the
[2565560.00s] influence of this painting over a whole
[2568470.00s] century of artwork it's a politic and if
[2571800.00s] you close it then this is what you see
[2573960.00s] and the question that I was asked was
[2576870.00s] about this panel you see this is the
[2579150.00s] Annunciation scene and there's a book
[2581250.00s] there in the background well it's not a
[2583560.00s] book it's a piece of the painting
[2585990.00s] depicting a book and so this is what
[2590190.00s] that looks like I mean so we're not
[2592920.00s] talking about something that is maybe
[2594800.00s] eight centimeters tall on the painting
[2597450.00s] and this is an enlargement and art
[2601140.00s] historians were wondering about whether
[2604830.00s] this represented a text or not and of
[2610500.00s] course I mean if you give me a new book
[2612810.00s] like that in museum I can't read it I
[2614760.00s] mean it's all vertical and horizontal
[2616440.00s] lines is literal for Mata but there are
[2620970.00s] people who can but they couldn't read
[2623070.00s] this one because well they couldn't and
[2627480.00s] many people said oh of course you can't
[2629550.00s] I mean it's not a real book I mean it's
[2631260.00s] a painting with little stripes on it to
[2633180.00s] mimic a book I mean nobody was going to
[2635730.00s] look that close and renege wouldn't and
[2638220.00s] I said other said but you know Van Eyck
[2639870.00s] was a real perfectionist in years but
[2643770.00s] the problem was that they couldn't read
[2645300.00s] it because of all these cracks you see
[2647580.00s] the thing is riddled with cracks he
[2649560.00s] already said it and and it's very hard
[2652410.00s] our visual system is very good at some
[2654720.00s] things but it's not good at thinking
[2657030.00s] away features like this and so I said
[2661050.00s] well but we can try to find those cracks
[2664230.00s] automatically and that was hard let me
[2666900.00s] tell you if I know no hard it was I
[2668400.00s] probably wouldn't have said opened my
[2669900.00s] mouth I mean and then once we've done
[2672030.00s] that we can in paint for that we have
[2673920.00s] good algorithms
[2675510.00s] when we did that we went from here to
[2677850.00s] here and when I first saw the result
[2680940.00s] I said well fat lot of God that is good
[2683190.00s] that has done I mean still unreadable
[2685640.00s] but not for experts actually they
[2689130.00s] identified 18 groups of words that
[2693020.00s] established for them that this was not
[2695820.00s] only a text but that they could identify
[2698190.00s] it was a copy that had been made in
[2701220.00s] Bruges 20 years later earlier of a
[2703950.00s] medieval book that had a treatise by
[2706860.00s] thumb of Aquinas on the Annunciation and
[2709670.00s] so it was in the end so so not only had
[2712500.00s] when I painted the real text but he had
[2714930.00s] actually picked the text that was
[2716610.00s] meaningful since several copies had been
[2718470.00s] made then they're now trying to do the
[2720210.00s] ideas that we want to to establish which
[2722490.00s] of those copies was used for but that's
[2724410.00s] a new project because that would be
[2726900.00s] interesting for the art historians to
[2728430.00s] know what connections from hawk had when
[2730950.00s] he painted this and but now I'm 32
[2734250.00s] seconds over so let me stop here thank
[2736620.00s] you
[2743010.00s] [Applause]
