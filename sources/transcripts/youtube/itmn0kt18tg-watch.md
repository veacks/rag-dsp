# YouTube Transcript

- URL: https://www.youtube.com/watch?v=iTMn0Kt18tg
- Video ID: iTMn0Kt18tg
- Segments: 1601

## Transcript (The following content is provided under)

[80.00s] The following content is provided under
[2000.00s] a Creative Common License. Your support
[4640.00s] will help MIT Open Courseware continue
[6879.00s] to offer high-quality educational
[8800.00s] resources for free. To make a donation
[11679.00s] or view additional materials from
[13519.00s] hundreds of MIT courses, visit MIT Open
[16560.00s] Courseware at
[20359.00s] ocw.mmit.edu. All right, let's get
[23400.00s] started. I'm Eric Demain. You can call
[26000.00s] me Eric. And today we're going to do
[28240.00s] another divide and conquer algorithm
[29920.00s] called the fastforier transform. It's
[32320.00s] probably the most taught algorithm at
[35440.00s] MIT. It's used in all sorts of contexts
[38399.00s] uh especially digital signal processing
[41440.00s] like MP3 compression all sorts of
[44079.00s] things. Uh but we're going to think
[45760.00s] about it today in the context of divide
[48160.00s] and conquer and polomials.
[51600.00s] So let me remind you I mean this class
[55199.00s] is all about polinomial time but usually
[58160.00s] with polinomial time we only care about
[59840.00s] the lead term. Today and today only
[63520.00s] pretty much we're going to be thinking
[65119.00s] about all the terms in a polomial. So my
[70159.00s] I'll talk about polomials mostly a and
[72479.00s] b. You have a constant term and then a
[75520.00s] linear term and a quadratic term and so
[79920.00s] on.
[81200.00s] uh up to I will say that there are n
[83280.00s] terms which means the last one is a n
[85360.00s] minus
[86920.00s] one. So normally the degree of the
[89360.00s] polinomial here is n minus one. Uh I
[92640.00s] wish the degree was defined to be n here
[94960.00s] but whatever that's I I can't change the
[97439.00s] definitions in algebra. So uh this is
[100640.00s] the traditional algebraic way of
[102320.00s] thinking about a polomial. Uh, of course
[105040.00s] you can write it with summation
[107159.00s] notation. Uh, a kx to the
[110680.00s] k= 0 to n minus one. We'll jump back and
[113759.00s] forth between them. I'm also going to
[115680.00s] introduce a vector notation for
[118200.00s] polomials. Uh, because
[122799.00s] uh so the ais are real numbers typically
[126399.00s] uh we might change that at some point.
[128640.00s] Um but usually a a common reason maybe
[131920.00s] you don't care much about polinomials
[133360.00s] but you definitely care about vectors
[135280.00s] any kind of one-dimensional data set is
[137440.00s] a string of real numbers like uh if
[140720.00s] you're sampling audio like right now
[142400.00s] we're recording this uh microphone
[145040.00s] you're seeing lots of different uh the
[148400.00s] movement of the membrane in this
[150160.00s] microphone over time you're sampling
[153440.00s] whatever uh 40,000 times a second each
[156480.00s] one you're measuring real number about
[157760.00s] where that thing is that is a sequence
[159599.00s] of real numbers. Now you can convert it
[161760.00s] into a polomial if you want. They're the
[164080.00s] same thing. X is not necessarily
[166080.00s] meaningful here. We really care about
[167760.00s] are the coefficients. Okay. Now given
[170400.00s] such a polomial there are three typical
[173040.00s] things we want to do. So these are the
[177440.00s] operations on
[183640.00s] polomials. I'll say why we want to do
[185920.00s] them in a second.
[188879.00s] So the obvious one if you do care about
[190720.00s] X is some kind of
[193720.00s] evaluation. So maybe I give you a
[196920.00s] polomial a of X and I give you a number
[201280.00s] let's call it
[202360.00s] X0 and I want to compute what is A of
[205640.00s] X0. So if I plug in X here is a general
[208800.00s] variable but if I give you an actual
[210879.00s] real number say for the X's what does
[214599.00s] that add up to?
[217760.00s] Okay. Uh so how how would you solve
[220720.00s] evaluation before we go to the other
[226840.00s] operations? I mean there's an obvious
[228879.00s] way uh we you know you compute all the
[232400.00s] terms and add them up. But uh if you do
[235360.00s] that naively computing
[238280.00s] uh x to the k well it's in this form
[242159.00s] maybe computing x to the k maybe takes k
[245000.00s] multiplications and so the total running
[247280.00s] time will be quadratic but we can do
[248879.00s] better than
[254280.00s] that. I know it's 11 o'clock too early
[256880.00s] in the morning to think, but
[265840.00s] yeah, when you've already calculated x
[268160.00s] to the i, you can calculate x i + 1 by
[270479.00s] multiplying. Good. Once you've computed
[272240.00s] x to the k, you can comput x the k + one
[275040.00s] in with one multiplication. And so you
[277520.00s] can uh compute all x to the n's in
[280880.00s] linear time and then do the all the then
[284560.00s] you're basically doing a dotproduct
[287120.00s] between the x to the k's and the a
[290280.00s] vector. Cool. My first
[295080.00s] frisbee. Uh
[297320.00s] so that's one way to do it. Uh there's a
[300080.00s] slightly slicker way to write it called
[301919.00s] her rule, but it's doing exactly the
[303680.00s] same thing that you said.
[308080.00s] Uh it's a this is just a nice algebraic
[310479.00s] way of writing it. A of x is the same as
[313919.00s] a 0 + x * a1 + x * a2 + and so on. Uh x
[322199.00s] * a n minus one and then lots of closed
[326600.00s] parenthesis. Um so this is of course
[329440.00s] equivalent to that expression by the law
[332960.00s] of distribution and uh this is
[335759.00s] essentially doing the x's x products one
[338080.00s] at a time. So this is clearly order n
[340560.00s] additions and multiplication. So we get
[343919.00s] order n time in this lecture time is the
[347919.00s] number of arithmetic operations. It's
[350320.00s] our model assume it takes constant time
[352160.00s] to multiply or add uh two real numbers.
[362199.00s] Okay.
[363720.00s] Um, cool. So, evaluation that's easy.
[367759.00s] Linear time for today is good. Quadratic
[370960.00s] is bad. We want to be quadratic. Okay.
[374479.00s] Second thing you might want to do with
[376080.00s] polinomials is add them. The third thing
[378960.00s] is multiply
[380360.00s] them. So, we're given two polinomials a
[384160.00s] of x and b of x.
[386560.00s] and we want to compute a new polomial C
[388639.00s] of X that is the summation. Now how do
[392080.00s] you define the summation? Well, you
[394319.00s] would like C of X to equal A of X plus B
[396960.00s] of X for all
[398360.00s] X. That's the definition. Uh, of course,
[401520.00s] we can do it algebraically as well
[403600.00s] because uh these are numbers in the end
[407039.00s] for any x this evaluates to a number. Uh
[409600.00s] so if we add two polinomials of this
[411600.00s] form, one with a eyes, one with the bis,
[414160.00s] all we're doing is adding corresponding
[417840.00s] a i's and b i. So this is easy. Uh we
[422400.00s] just need ck to equal a k plus
[427160.00s] bk for all k. So again, linear time, no
[432160.00s] problem.
[433759.00s] Okay, third
[435319.00s] operation is the exciting one, the hard
[438240.00s] one to get
[441400.00s] good. Otherwise, this lecture would be
[443680.00s] over in a couple more
[445800.00s] minutes. So, multiplication, same deal.
[448800.00s] We're given a of x and b of x and we
[451840.00s] want to convert that into some c of x uh
[455680.00s] that for all x evaluates to the product
[459039.00s] of those two polinomials.
[463800.00s] Okay, how do we do this?
[466680.00s] Uh, we can't just multiply corresponding
[470319.00s] AKs and bks. Uh, in fact, if you take a
[474080.00s] big thing like this, you multiply it by
[475840.00s] corresponding big thing. Uh, let's do
[477919.00s] it.
[491360.00s] This doesn't look like
[496039.00s] fun. Uh we get let's see so the constant
[499840.00s] term is just the product that's easy of
[502560.00s] the constant terms. Uh but then if I
[505120.00s] take this product or this product I get
[507520.00s] linear terms. So that's going to be a1 b
[510479.00s] 0
[512240.00s] uh + a 0 b1 * x and then there's a
[517039.00s] quadratic term which I get from switch
[521479.00s] colors. Uh this and this and this. So
[526320.00s] there's three things times x^2. And
[529519.00s] that's where I get tired. I'm going to
[531760.00s] switch to the summation notation. you uh
[536399.00s] I didn't go to high school, but I assume
[537680.00s] in high school algebra you learned this.
[539880.00s] Uh
[541880.00s] CK is the sum of J=
[546760.00s] 0 to
[549240.00s] K A J B K minus J. That's the general
[554480.00s] form because uh AJ came from an X to the
[557519.00s] J term. BK minus J came from an X to the
[560080.00s] K minus J term. When you multiply those
[562240.00s] together, you get X to the K. So this is
[564640.00s] the coefficient of x to the k.
[567720.00s] Cool. So that's what we'd like to
[569959.00s] compute given a and b. We want to
[572480.00s] compute this polinomial c. How long does
[574959.00s] it
[578040.00s] take? We have to do this for all
[580680.00s] k. So to compute the kith term takes
[583519.00s] order k time. So total time is n^
[591320.00s] squ. So that's not good for this
[594640.00s] lecture. Uh we want to do better. Uh in
[597440.00s] fact today we will achieve
[602720.00s] uh n
[605480.00s] login that's our goal polomial
[608800.00s] multiplication in n login. Why do we
[611760.00s] care about polomial multiplication?
[614320.00s] uh because it's equivalent to another
[616079.00s] operation which we use all the time in
[618880.00s] digital signal processing, image
[621279.00s] editing, all sorts of different things
[623600.00s] which is
[631480.00s] convolution. Uh convolution is usually
[634000.00s] thought of as an operation on vectors.
[643640.00s] Uh
[645560.00s] so remember this vector notation where
[648720.00s] we're just thinking about the
[649519.00s] coefficients. X's are kind of
[650880.00s] irrelevant. Just thinking about a
[652320.00s] sequence of real numbers. Uh so maybe
[654720.00s] that sequence of real numbers for a
[656880.00s] represents some I don't know waveform.
[659920.00s] Maybe this is the audio I'm speaking
[662040.00s] now. And then I take some other waveform
[665920.00s] here. I have uh Gaussian function eus
[670040.00s] x^2. And I want to take uh for all
[674000.00s] possible shifts of this Gaussian, I want
[676880.00s] to compute the dotproduct between the
[679040.00s] blackboard and the piece of paper. Okay,
[681440.00s] that's some kind of smoothing function.
[682959.00s] If I wanted to clean up noise or
[685600.00s] something like that, you can do the same
[687040.00s] thing on a two-dimensional image. It's a
[688959.00s] little harder to think about, but you
[690240.00s] can map a two dimensional image to a
[691600.00s] one-dimensional vector and you have a
[693200.00s] two-dimensional Gaussian. If you ever do
[694720.00s] Gaussian blur in Photoshop, uh this is
[697200.00s] what you're doing, a convolution. uh and
[699680.00s] it's used to like as if you're pretend
[702320.00s] that your lens was out of focus when you
[704640.00s] do that. Uh it's done in in audio
[707760.00s] processing and all sorts of things. Uh
[710160.00s] so formally you're given two vectors and
[714560.00s] you want to take all possible shifts of
[716560.00s] one vector and take the dotproduct with
[718800.00s] the other one. I have that written down.
[722000.00s] uh just uh dotproduct same thing as
[725680.00s] inner product which just means multiply
[728399.00s] corresponding uh positions and add them
[741240.00s] up. And if you ignore this minus sign
[744639.00s] that's exactly what this is doing. This
[746160.00s] is taking a j versus b k pretend it's
[749839.00s] plus j. So that's the BJ vector but with
[753519.00s] all possible shifts K. We compute this
[755360.00s] for all
[757079.00s] K. That's really cool. We're going to
[760160.00s] compute it in n login time. All
[762399.00s] different n shifts of b will take the
[764560.00s] dotproduct with a. It's kind of magical
[766399.00s] because it looks like you're doing n squ
[767760.00s] work but we will do it in n login time.
[772120.00s] Uh the only issue is we have to reverse
[775120.00s] b. Uh then the minus signs turn into
[777600.00s] plus signs. Okay. And there's some
[779440.00s] boundary conditions, but it's basically
[781200.00s] the same. If we can solve polomial
[782800.00s] multiplication, we can solve
[784440.00s] convolution.
[786040.00s] Cool. So that's why we care about
[790360.00s] multiplication. Uh so how are we going
[792800.00s] to solve
[794279.00s] this? What I'd like to do is talk about
[797519.00s] alternate representations of polomials.
[799920.00s] That's next thing here. We just did
[801839.00s] operations. Let's talk about different
[804120.00s] representations. So we talked about this
[806240.00s] one representation. It's one way to
[808399.00s] represent a polomial but it's not the
[810880.00s] only one. You probably know
[814680.00s] others. So on the one hand we have
[820839.00s] uh representation a is a coefficient
[828600.00s] vector. So we can write down the ais.
[832320.00s] That was just one way to represent
[835279.00s] uh a polomial. Can anyone give me
[838079.00s] another way to represent polinomial? I
[840160.00s] have two ways in mind. So yeah,
[842160.00s] generating function. Generating
[843920.00s] function. Isn't that the same? Oh, I
[846399.00s] guess
[848040.00s] uh in principle you could imagine like
[851440.00s] writing a recurrence on the generating
[853040.00s] function or something. It's plausible.
[854959.00s] In general, generating functions are
[856480.00s] polinomials. If you know what that if
[858000.00s] they are, cool. Um so it doesn't quite
[860560.00s] answer the question yet.
[863199.00s] Sure. Representation. Sorry. point point
[866800.00s] representation. Yeah, I call them
[869560.00s] samples. Uh I'm going to put that under
[874440.00s] C. A bunch of samples, a bunch of points
[877279.00s] on the polomial. Uh so like X K
[882160.00s] uh Y
[885160.00s] K
[888920.00s] for how many do we need? I think N minus
[891760.00s] one should do it. Double check. Yep. Uh
[895839.00s] and if we are told that a of x k equals
[899360.00s] y k and we're told that all the x ks are
[906440.00s] distinct, then this uniquely determines
[909519.00s] the polomial. If you have a degree n
[912399.00s] minus one polinomial and you have n
[914600.00s] samples, there's only one polinomial
[916880.00s] that passes through all those points.
[919600.00s] That's uh it's a consequence of the
[921680.00s] fundamental theorem of of algebra that
[925040.00s] gives you uniqueness. Existence I think
[927440.00s] was proved by Lejandra in 17 1800s long
[931519.00s] time ago. This is good. This is what
[934079.00s] we're going to use. There's another
[935839.00s] answer. I should give you a frisbee
[939320.00s] first. You're so
[941320.00s] excited. Just wait till I hit you and
[943440.00s] then be less excited. Okay. So, samples,
[948480.00s] coefficients, anything else? Yeah,
[952160.00s] roots.
[955399.00s] Yeah, roots is the other answer I was
[958320.00s] looking for, but it's not going to be so
[960079.00s] good algorithmically as we'll see.
[962839.00s] Sorry. Um, so I could give you a
[966079.00s] sequence of roots. This is the
[967199.00s] fundamental theorem of algebra that
[968720.00s] every polinomial is uniquely determined
[971600.00s] by its set of roots. If you allow roots
[974000.00s] with multiplicity uh then every
[976000.00s] polinomial of degree n has exactly n
[978519.00s] roots. So this would be some sequence of
[982320.00s] r1 up
[983639.00s] to r n -1
[987279.00s] um and the polomial would be given as
[989519.00s] you actually need a constant multiplier
[992000.00s] but x - r0 x -
[995959.00s] r1 that would be polomial. The trouble
[1000240.00s] with roots is that if I give you a
[1002160.00s] coefficient vector and I want to compute
[1004079.00s] the roots, not only is it hard to do,
[1006480.00s] it's impossible to do in our model if
[1008800.00s] you're only allowed to add, subtract,
[1010639.00s] multiply, divide, take square roots,
[1012399.00s] take kith roots. Uh there is no way to
[1015440.00s] solve a polomial of degree five or
[1018320.00s] larger. You know, there's quadratic
[1019759.00s] formula, cubic formula, cortic formula.
[1021839.00s] There is no quintic formula. It's an old
[1023839.00s] result 1800s. So uh going from
[1026880.00s] coefficient vector to roots takes
[1028720.00s] infinite time. It's not so good. Uh and
[1031679.00s] in particular if we think about our
[1033280.00s] operations uh addition becomes really
[1036679.00s] difficult. Uh multiplication is easy. If
[1039360.00s] I have two uh polomials represented as a
[1042959.00s] sequence of roots I want to multiply
[1044319.00s] them. That's just concatenating the
[1046000.00s] vectors uh taking the union of the
[1048799.00s] vectors of the of the root lists. So
[1051840.00s] that's cool. multiplying the C's I guess
[1054080.00s] but addition is really hard because
[1055760.00s] addition is sort of fundamentally about
[1057760.00s] coefficient vectors uh and then once you
[1061760.00s] go there you can go from roots to
[1063440.00s] coefficient vectors and add them up but
[1065039.00s] then there's no relation between the
[1066400.00s] roots of the sum of the polinomials
[1068640.00s] versus the roots of the original so uh I
[1072400.00s] don't know for sure that that's
[1073360.00s] impossible it's definitely very very
[1074880.00s] hard probably
[1076919.00s] impossible so
[1081160.00s] Uh let me draw a little
[1083880.00s] table. Each of these representations has
[1087280.00s] some advantages and a
[1089240.00s] disadvantage in terms of these three
[1091440.00s] operations. So on the one hand we have
[1096799.00s] uh the sort of algorithms we care about
[1101400.00s] uh
[1106919.00s] evaluation
[1108440.00s] addition and
[1117880.00s] multiplication. And on the other axis we
[1120559.00s] have our representations which are
[1123440.00s] coefficient vectors
[1127000.00s] uh
[1130440.00s] roots and samples. You'll see why I
[1132880.00s] chose this order in a moment. It makes
[1134320.00s] for a nice pretty matrix. Uh
[1142840.00s] so we've talked about almost every cell
[1145600.00s] in this matrix. Uh but let me just
[1147840.00s] summarize. So we started out just
[1149840.00s] thinking about uh coefficient vector and
[1152720.00s] evaluation was linear
[1155400.00s] time, addition was linear time,
[1158559.00s] multiplication so far is quadratic.
[1160880.00s] Although our goal is to make n login n
[1164440.00s] for
[1165960.00s] roots I just said multiplication is
[1168240.00s] easy. That's linear time. addition is
[1170640.00s] really
[1173559.00s] hard like infinite time and evaluation I
[1179120.00s] guess that's linear time in fact the way
[1182559.00s] it's written you only have a linear
[1184240.00s] number of subtractions and
[1185280.00s] multiplications so it's really easy to
[1187200.00s] evaluate
[1188880.00s] uh and then sample vectors we haven't
[1191280.00s] talked much about that um so the idea is
[1195679.00s] suppose you're given two polomials with
[1198240.00s] the same x K's. We're going to fix X
[1200720.00s] K's. All we need is that they're
[1201840.00s] distinct. So X K could equal K, for
[1203760.00s] example, just a bunch of integers. And
[1206400.00s] then we are told what polinomial A
[1209679.00s] evaluates to at every X K. And we're
[1211600.00s] told what polinomial B evaluates to at
[1213840.00s] every X K. So we're given some YKS and
[1216320.00s] some
[1217240.00s] ZK's. And then we want to compute say
[1220000.00s] the the sum or the product of those two
[1224080.00s] vectors. What do we do?
[1226559.00s] just add or multiply the corresponding
[1229679.00s] uh yk and z case, right? Because if
[1233120.00s] we're told we want uh c of x to equal a
[1236799.00s] of x * b of x or c of x to equal a of x
[1239440.00s] plus b of x for all x, well, now we know
[1241760.00s] what x's we care about. We just do it at
[1243440.00s] the x ks. That's what we're told for a
[1245679.00s] and for b. And so to compute c of x k,
[1249360.00s] it's just the sum or the product of yk
[1251520.00s] and zk. Okay, so multiplication is
[1254320.00s] really easy in the sample view and this
[1256559.00s] is why we are going to use this view.
[1259440.00s] We're also going to use this view
[1261360.00s] because as we'll see there's a problem.
[1263919.00s] Uh addition is easy, multiplication is
[1267799.00s] easy,
[1269480.00s] evaluation is annoying.
[1273039.00s] uh I can evaluate a of x k at or a of x
[1276559.00s] at x k for any k but I can't evaluate it
[1280159.00s] at some at some arbitrary value of x
[1283520.00s] okay that's annoying I'm told at these
[1286400.00s] finite sample points but now I have to
[1287840.00s] somehow interpolate this is called
[1289440.00s] polinomial interpolation well studied in
[1291919.00s] numerical analysis and so on you can do
[1294440.00s] it but uh it takes quadratic time in
[1298320.00s] general best known algorithms are
[1300480.00s] quadratic
[1304919.00s] So this is
[1307080.00s] bad, this is bad, and this is
[1311159.00s] bad. So no representation is
[1315400.00s] perfect. Life
[1317240.00s] sucks. Uh what we'd like is to get the
[1320400.00s] best. Now this one is really hard to
[1322000.00s] work with because converting into roots
[1323600.00s] is sort of impossible is impossible in
[1326559.00s] our in an arithmetic model. So we're
[1328880.00s] going to focus on column A and column C.
[1332240.00s] We kind of like to take the min of those
[1334640.00s] two columns. We won't quite get that.
[1337520.00s] What we will get is an algorithm for
[1340159.00s] converting between these two
[1341880.00s] representations in n login
[1344600.00s] time. So not quite linear but close. And
[1348480.00s] once we can do that if we want to
[1350000.00s] multiply two things in the coefficient
[1352240.00s] land we can convert to sample land do it
[1355280.00s] in linear time and then convert
[1357159.00s] back. So uh that's the magical
[1360640.00s] transformation we're going to cover and
[1362720.00s] it is called the fastforier transform.
[1364400.00s] Fastfor transform is the algorithm
[1366320.00s] discrete 4A transform is that
[1368159.00s] transformation
[1369679.00s] uh
[1372200.00s] mathematically. Cool. So the whole name
[1375120.00s] of the game is converting uh from
[1377280.00s] coefficient representation to samples or
[1380080.00s] vice versa. Turns out they're almost the
[1381840.00s] same though that won't be obvious for a
[1383600.00s] long time till the end of the class. Any
[1386159.00s] questions before we proceed? Yeah.
[1392000.00s] Why don't we evaluate a
[1394919.00s] bip? Ah uh so okay the question is uh if
[1400320.00s] I want to we'll get there in a second
[1402640.00s] but if I want to multiply uh and it's so
[1405280.00s] easy to do in sample land why don't I
[1406880.00s] just sample A and B and then multiply
[1409280.00s] them that's right uh but in fact
[1411360.00s] sampling is not so easy it takes
[1413039.00s] quadratic time let's go there
[1422200.00s] now because we have n samples to do each
[1424880.00s] one will cost linear time. Uh remember
[1428159.00s] to evaluate a polinomial takes linear
[1430240.00s] time. If you want to think of it in a
[1432880.00s] matrix that's entered the matrix
[1436200.00s] uh then we get a big matrix.
[1453919.00s] So we're given the x i's and we just
[1456559.00s] want to evaluate a given polomial uh
[1459200.00s] whose coefficients are given by a 0 a1
[1464600.00s] a2 n minus one. Our goal is to compute
[1468159.00s] the y i's y 0 y1 y
[1472600.00s] 2 to yn minus
[1475000.00s] one. Uh and so you can if you know a
[1477440.00s] matrix vector product you take this row
[1480159.00s] with that column you take the dotproduct
[1481919.00s] that multiplies corresponding entries
[1484080.00s] you get y0 that is the definition of the
[1486400.00s] polinomial evaluation I'm just going to
[1488480.00s] write a bunch of these
[1490520.00s] rows you get the
[1497640.00s] pattern
[1499799.00s] pretty simple
[1509360.00s] Okay, this is called the Vandermond
[1519480.00s] matrix. I'll call it
[1522120.00s] V. And in general, uh I have room for
[1526480.00s] it. So then we go
[1540559.00s] In general, if we look at uh
[1543080.00s] VIG, it's just um sorry there you may
[1548080.00s] notice I'm not using the letter I. We
[1550080.00s] will get to why in a moment. VJ K uh row
[1554320.00s] J column K. That's going to be x subj to
[1558000.00s] the power k. That's the vendor matrix.
[1561640.00s] Um, we can compute it in quadratic time.
[1564559.00s] It has quadratic entries. We can use the
[1566240.00s] trick suggested earlier. Compute each
[1568320.00s] term from the previous one uh by
[1570880.00s] multiplying by
[1572760.00s] xj. Uh, and then we want to compute this
[1575520.00s] matrix vector product. And you can
[1578400.00s] clearly do it in quadratic time uh just
[1581440.00s] computing each thing correspondingly.
[1583840.00s] And that's sort of the best you can do
[1585520.00s] without any further assumptions. So this
[1587200.00s] takes uh so if I I want to compute this
[1590400.00s] product that's the uh
[1593000.00s] coefficients to samples
[1597080.00s] problem. Uh this is the same thing as
[1600919.00s] computing v times the a vector. So this
[1606159.00s] is a matrix vector multiplication which
[1608640.00s] takes uh n^2
[1613080.00s] time. Okay. On the other hand, so that's
[1617360.00s] a problem because we're trying to beat
[1619279.00s] quadratic multiplication. So if we spend
[1621360.00s] quadratic time to convert over here, it
[1623039.00s] doesn't matter if this is linear time.
[1624640.00s] There are two problems. One is that
[1625919.00s] conversion costs too much. The other is
[1627440.00s] we don't yet know how to convert
[1628760.00s] backwards. Uh but this matrix view gives
[1631440.00s] us also the reverse transformation. If
[1633919.00s] we want to convert
[1635640.00s] samples to coefficients,
[1641279.00s] uh this
[1642520.00s] is uh the best notation I know is from
[1645919.00s] mat lab. How many people know mat lab? A
[1648559.00s] bunch. So for you it's v back slash a
[1651600.00s] but uh usually in linear algebra like
[1653919.00s] 1806 you see you have you have uh some
[1657279.00s] matrix v times some unknown vector.
[1660559.00s] Usually it's called x. Here it's called
[1662159.00s] a. And you know the right hand side and
[1664400.00s] you want to solve for this. How do you
[1666159.00s] do it?
[1670960.00s] Sorry.
[1673919.00s] Multiply by the inverse. Yeah. How do
[1675679.00s] you do it in computer science?
[1677760.00s] Elimination. Gaussian elimination. Turns
[1679520.00s] out inverse is the right answer here.
[1681360.00s] But uh Gaussian elimination would be the
[1683440.00s] standard way to solve a linear system
[1685679.00s] like that. trouble with galsian
[1688200.00s] elimination is it takes cubic
[1691159.00s] time and it's in its normal
[1694120.00s] form. Uh in this case it's a little bit
[1697440.00s] special because this matrix is
[1699039.00s] essentially fixed. The x i's don't need
[1701520.00s] to change. It could be x i is just i or
[1705279.00s] something. Uh so we can in this case
[1707279.00s] it's a little better to compute the
[1708720.00s] inverse first. Uh so we could also just
[1711279.00s] do V inverse times A. Uh from a
[1715840.00s] numerical analysis standpoint this is
[1717279.00s] very bad but don't worry about it for
[1718799.00s] now. We're going to get a better
[1719919.00s] algorithm today anyway. It doesn't
[1721960.00s] involve matrices at all. But the nice
[1724640.00s] thing is if uh computing V inverse that
[1726799.00s] takes n cubed time but you only have to
[1728320.00s] do it once. So if you have to do this
[1729840.00s] many times uh you can do this product in
[1732960.00s] n squ time. You just have to maintain
[1735200.00s] that v inverse for once and for all.
[1739279.00s] Okay. Uh, great. So, we got quadratic
[1741200.00s] algorithms to go back and forth between
[1743039.00s] these representations. That at least
[1744399.00s] tells us it's doable. But, uh, we we of
[1748960.00s] course need better than quadratic to
[1750320.00s] improve on the naive uh, multiplication
[1753720.00s] algorithm. So, that's what we're going
[1755520.00s] to
[1756520.00s] do. Uh, in general, we can't do any
[1759919.00s] better. But we have one freedom which is
[1763679.00s] we have said nothing about the x case.
[1766320.00s] We can choose them to be whatever they
[1768000.00s] we want them to be. I keep saying x k
[1770799.00s] equals k. That seems fine. It's actually
[1773440.00s] a really bad choice for a reason we will
[1775279.00s] get to. Uh but there is a choice where
[1777840.00s] magically this transformation becomes
[1779720.00s] easy and you can do it in n login
[1783000.00s] time. Before we get there
[1786520.00s] uh I want to give you
[1788919.00s] some motivation
[1791399.00s] for how how this could possibly work.
[1814799.00s] And as you might expect even just from
[1816799.00s] the n login running time we're going to
[1819200.00s] be using divide and
[1822679.00s] conquer. So let's just think about how
[1825200.00s] divide and conquer could work. Uh and
[1828720.00s] I'm going to show you an idea and then
[1831200.00s] we'll figure out how that idea could
[1832640.00s] possibly work. At the mo it doesn't work
[1834640.00s] at the moment but we we'll be able to
[1836799.00s] choose the x case so that it
[1839000.00s] works. So let's say uh the
[1842840.00s] goal I mean what we want to do is
[1845120.00s] compute this uh v * a I'm going to
[1848320.00s] convert think of that back into mat into
[1851760.00s] polomial uh land. So our goal is to
[1855120.00s] compute a of x uh for all x in some set
[1863640.00s] x. Okay, this is uh taking a bunch of
[1868520.00s] samples. Those uh the set X is just a
[1871360.00s] set of the XKS, but I'm going to change
[1874080.00s] that set in a moment uh using recursion.
[1877840.00s] So I want to think so the input to this
[1880320.00s] algorithm is a polinomial A of X and
[1882640.00s] it's a set capital X of positions that
[1886559.00s] I'd like to evaluate that polomial at.
[1888480.00s] This is clearly more general than the
[1889919.00s] problem we're trying to solve and I'm
[1892480.00s] going to solve it with divide and
[1893600.00s] conquer. So in divide and conquer there
[1894960.00s] are three steps. Divide, conquer, and
[1897399.00s] combine. Right? So uh let's start with
[1902600.00s] divide here's the big idea.
[1907080.00s] Uh I would say there are two natural
[1909360.00s] ways to divide a vector. One is in the
[1911360.00s] middle. That's what we've always seen
[1912720.00s] with merge sort and divide and conquer
[1914480.00s] uh and u convex hull from last time. But
[1918559.00s] there's another way which will work
[1920159.00s] better here which is the even entries
[1923039.00s] and the odd
[1924360.00s] entries. So I'm going to divide into
[1926799.00s] even and odd
[1934200.00s] coefficients. So let me write that down.
[1937360.00s] Uh one of them is called a sub even of
[1940240.00s] x. That's a polomial. It's going to have
[1942399.00s] half the degree. So it's going to be sum
[1945760.00s] from k= 0
[1949799.00s] to I wrote n here but I think I want
[1952480.00s] something like n /
[1954120.00s] 2 -1 n - 1 /2 one of those things uh of
[1960519.00s] a
[1962360.00s] 2k x to the
[1964840.00s] k. So really really what I want which is
[1968480.00s] easier to write in the vector notation.
[1971279.00s] I want all the even
[1973799.00s] entries. Okay, I won't try to figure out
[1975919.00s] what the last one is but it's roughly n
[1979559.00s] /2ish. I'll just write that. Uh you
[1982480.00s] could go a little bit extra. That's
[1983760.00s] fine. Uh if you define a subn to be zero
[1986240.00s] and a sub n plus one to be zero and all
[1988000.00s] those to be zero those terms will
[1989600.00s] disappear. So uh the key thing here is
[1992000.00s] I'm taking the even entries but I'm I'm
[1994399.00s] I'm not I don't have 2k up here right?
[1997440.00s] So this is the x to the zero term. This
[2000720.00s] is the x to the one term. This is the x
[2002559.00s] to the 2 term. So there's a difference
[2004880.00s] between x to the k's and the the a uh
[2008240.00s] sub 2k. But I mean just think about it
[2010880.00s] in vector form. Don't worry about the
[2012640.00s] algebra for now. We're going to have to
[2014080.00s] worry about it in a second. But
[2016080.00s] intuitively what I want to do is extract
[2019120.00s] from the vector of all the ais uh these
[2022480.00s] two vectors
[2024840.00s] the odd coefficients in order and the
[2028480.00s] even coefficients in order. But I'm
[2031039.00s] going to need the algebraic form in a
[2033120.00s] moment for the combined
[2037640.00s] step. So this should be 2k + 1 x to the
[2041679.00s] k
[2045640.00s] Okay, that's step
[2049240.00s] one. Easy to do. Linear time, of
[2052280.00s] course. Um, let's jump ahead to step
[2055839.00s] three,
[2059800.00s] combine. In order to compute a of x from
[2064320.00s] what I'd like to do is recursively
[2065839.00s] compute a even of x and a odd of x for
[2068159.00s] some values x. It's not going to be x
[2069919.00s] and x. It's going to be some other set.
[2072320.00s] And let's think about how I could
[2074399.00s] compute a of x given some solutions to a
[2077679.00s] even of x and a odd of x. So this is
[2082679.00s] step
[2088280.00s] three combine.
[2092960.00s] So, uh, I would
[2096680.00s] like a of x over here and I want a even
[2104000.00s] of
[2105240.00s] something and a odd of something and
[2111200.00s] something in here. Uh, anyone see the
[2118200.00s] algebra? Maybe start with this.
[2124960.00s] I hear a mumble. Yeah. X. X squ.
[2131240.00s] Exactly. Time for a purple
[2135880.00s] one. Getting better. Uh why X squ?
[2139119.00s] Because we have this mismatch here. We
[2141920.00s] have a sub 2K. We want x to the 2k. How
[2145680.00s] could we do that? Well, we could put x^2
[2147920.00s] to the 2k. uh and you know
[2151240.00s] x^2 oh sorry x^2 to the k is the same
[2154720.00s] thing as x^ the
[2157160.00s] 2k okay and so magically this transforms
[2160960.00s] into the even entries of a of x that's
[2164960.00s] half of them we do the same thing for
[2167119.00s] the odd ones and we're almost
[2170040.00s] there now we have a sub 2k + 1 * x to
[2175119.00s] the 2k no + one so how can I turn it add
[2179440.00s] a plus
[2180920.00s] one multiply by x out here take the
[2185680.00s] whole thing multiply by x then I get all
[2188480.00s] of the odd terms of a of x I add these
[2191640.00s] together I get a of x okay it's uh I
[2195920.00s] mean you could prove this more carefully
[2197520.00s] but uh sort of that's just algebra to
[2201359.00s] see that this is correct once you have
[2203520.00s] this it tells you what I need to do is
[2205920.00s] compute a even of x^2 for all x and x.
[2210960.00s] So this is uh for x and x. There's a for
[2214560.00s] loop for you. So that's going to take
[2216480.00s] linear time. If I already know this
[2218240.00s] value and I already know this value, I
[2220560.00s] do one multiplication, one addition, and
[2222800.00s] boom, I get a of
[2224920.00s] x. So in the conquer step, I want to uh
[2234599.00s] recursively compute
[2240000.00s] uh I'll call it a even of
[2244440.00s] y and a
[2247480.00s] odd of
[2250760.00s] y for y in x squared. x^2 is the set of
[2258079.00s] squares of all numbers in
[2261960.00s] x. Okay, so I'm changing my set x. I
[2264880.00s] started with a polinomial A and a set X.
[2268240.00s] Recursively I'm doing a different
[2270320.00s] polomial of half the
[2272680.00s] degree, half the number of terms
[2276400.00s] uh but with a different
[2279320.00s] set of the same size. Okay, I started
[2283200.00s] with X. X squar has the same size as X,
[2287400.00s] right? So let's try to figure out how
[2290960.00s] fast or slow this algorithm is.
[2295680.00s] But that is a divide and conquer. That
[2297280.00s] is going to be our golden ticket. It's
[2300400.00s] pretty
[2303480.00s] simple. Uh but we're going to need
[2305440.00s] another trick. So um I'm going to write
[2308720.00s] a recurrence. Now this this recurrence
[2311359.00s] depends kind of on two things. One is
[2313520.00s] how many terms are there in a that we've
[2316079.00s] been calling n. And the other is how
[2318560.00s] many numbers are there in x? How many
[2320560.00s] different places do I have to evaluate
[2321920.00s] my polomial? So we've got t of n and
[2326079.00s] I'll just call it size of
[2329720.00s] x. Okay. Uh so divide and conquer goes
[2333760.00s] handinhand with recurrences. Generally
[2336079.00s] you've got the recursive part. So that's
[2338720.00s] just how big are the sub problems? How
[2340640.00s] many are there? There are two subpros.
[2343040.00s] They have half the size in terms of n
[2345839.00s] but they have the same size in terms of
[2347680.00s] x.
[2350920.00s] So, all right. 2 * because there's two
[2354680.00s] subpros each of size n /2
[2358160.00s] uh and size
[2361240.00s] x. Okay.
[2363800.00s] Plus what goes here is however much it
[2366720.00s] costs to do the divide step plus however
[2369040.00s] much it costs to do the combined step.
[2370640.00s] All the non-recursive parts. Well, this
[2372960.00s] is just partitioning the vectors. Linear
[2374880.00s] scan linear time. uh this is we we
[2378960.00s] talked about it's a constant number of
[2380880.00s] arithmetic operations for each x. So
[2383680.00s] this costs order x time this cost order
[2386160.00s] n
[2387160.00s] time right? So in general we
[2391160.00s] get n +
[2394440.00s] x. Now this is not again not a recurrent
[2397760.00s] solvable by the master method because it
[2399760.00s] has two variables and uh so probably the
[2403920.00s] usually when you're faced with this sort
[2405280.00s] of thing you want to do kind of back of
[2406720.00s] the envelope picture uh draw a recursion
[2409520.00s] tree good way to go. So at the root now
[2413520.00s] I know that initially x equals n right
[2416720.00s] when I start out I have n coefficients I
[2418800.00s] have n different positions I want to
[2420320.00s] evaluate at them at because that's what
[2422720.00s] I want to do to do this conversion from
[2424400.00s] coefficients to samples. So at the root
[2427440.00s] of the recursion tree, I'm just going to
[2428640.00s] write n order n work to get started and
[2431599.00s] to the do the recursions. There are two
[2433920.00s] recursive calls. One has both have size
[2437359.00s] n /2 in terms of a and they have size
[2440480.00s] the same x which is also known as n in
[2444480.00s] those two recursions. So in fact the
[2446320.00s] linear work here will be n and n and
[2448960.00s] then we'll get n and n. x never goes
[2451520.00s] down. So x always remains n the original
[2454960.00s] value of n. This is a bad recurrence. Uh
[2459280.00s] there are n sorry there are login
[2461040.00s] levels. That's the good news. Once we
[2463200.00s] get down to constant size we can kind of
[2465760.00s] stop when there's only one coefficient.
[2467920.00s] I know how to evaluate the polinomial
[2470000.00s] with with just a zero. That's easy. Uh
[2473119.00s] so down at the bottom here at the last
[2475880.00s] level so this is height log n. The last
[2479440.00s] level is just it's again going to be a
[2481040.00s] whole bunch of n's all the same n here.
[2483760.00s] n is the original value of x because we
[2485839.00s] haven't changed that. How many n's are
[2488079.00s] there down here?
[2493760.00s] H two to the log n also known as n.
[2499960.00s] Yeah, good. So we had uh because we had
[2503359.00s] login levels we had binary branching so
[2505920.00s] it's two to the number of levels which
[2508000.00s] is just n. So this
[2510680.00s] is
[2513079.00s] n^2. All this work still
[2520440.00s] n^2. Clearly what we need is for x to
[2524319.00s] get smaller too. Right? If x if in this
[2528880.00s] recursion let me uh in red draw the
[2531200.00s] recursion I would like to have.
[2536000.00s] If x became x over two here, that's the
[2538800.00s] only change we'd need. Then n and x
[2542319.00s] change in exactly the same way. And so
[2544800.00s] then we can just forget about x. It's
[2546960.00s] going to be the same as n. Then we get 2
[2549599.00s] * n
[2550680.00s] /2 plus order n. Look familiar? It is
[2554800.00s] our breadand butter recurrence. Merge
[2556400.00s] sort recurrence. That's n
[2558440.00s] login. That's what we need to do.
[2561240.00s] Somehow when we convert our set
[2565319.00s] x to x^2 I want x to get
[2571400.00s] smaller. Is that at all plausible? Let's
[2573920.00s] think about
[2583000.00s] it. What's the base case? Um keep things
[2587040.00s] simple. Let's say the base case when
[2590839.00s] uh x= 1 I'll just let x be let's say I
[2595839.00s] want to compute uh my a at one keep it
[2600200.00s] simple. Okay. What if I what if I want
[2604079.00s] two values in x? I'd like to have the
[2606960.00s] feature that when I square all the
[2608640.00s] values in x, so I want two values, but
[2612319.00s] when I square them, I only have one
[2617319.00s] value. Solve for x.
[2624400.00s] Yeah. One and one. Negative one and
[2631240.00s] one. Not bad. Good
[2634680.00s] catch. Negative 1 and one. That could
[2637240.00s] work, right? What are negative 1 and
[2639920.00s] one? They are the square roots of one,
[2642240.00s] right? - 1^2 is 1. 1^2 is 1. There's two
[2646240.00s] square roots for every number. Two
[2648319.00s] square roots for every number.
[2650359.00s] Interesting. So that means if I just
[2652800.00s] keep taking square roots, when I square
[2654960.00s] them, it collapses by a factor of two.
[2658480.00s] Uh let
[2661240.00s] me let me go to another
[2666280.00s] board and define
[2674040.00s] something. you're all anticipating
[2676079.00s] what's going to happen, but I'm going to
[2678920.00s] say a
[2680920.00s] collapsing set x
[2685119.00s] uh or a set is collapsing if either
[2689720.00s] um the size of x² is the size of x / 2
[2697280.00s] uh and recursively x^2 is collapsing.
[2704640.00s] because I need this to work all the way
[2706160.00s] down the recursion or I need a base case
[2709040.00s] which is just x= 1. There's a single
[2711599.00s] item in x. So I happen to start with x
[2714240.00s] equals the item one. It didn't have to
[2716240.00s] be one. Could have been seven. It
[2719200.00s] couldn't be zero cuz zero uh you won't
[2722240.00s] get two numbers. There's only one square
[2724160.00s] root of zero. Okay, so I lied a little
[2725920.00s] bit. Other than zero, every number has
[2728480.00s] exactly two square
[2730040.00s] roots. So what's the square root of
[2733440.00s] negative one? I
[2736599.00s] I
[2738359.00s] so complex numbers. So if I take square
[2741839.00s] roots of these guys, I get I and
[2745680.00s] negative I and again I get minus1 and
[2750359.00s] 1. Okay, that's when x= 4. Turns out
[2754720.00s] this is only going to work for powers of
[2756240.00s] two. But hey, if n isn't a power of two,
[2758160.00s] just round up to the next power of two.
[2759760.00s] That only hurts me by a factor of two.
[2762640.00s] Okay, complex numbers. Okay, every time
[2765599.00s] I said real number in the past, pretend
[2768079.00s] I said complex number. Everything I said
[2770400.00s] is still true. Actually, the root thing
[2772720.00s] is only true when you allow complex
[2774480.00s] numbers. Some polinomials have complex
[2776480.00s] roots. Okay, so pretend I said complex.
[2780000.00s] We're going to need complex numbers.
[2781359.00s] This is why because when we start taking
[2783359.00s] square roots we immediately get uh
[2786960.00s] complex numbers. Okay. Next would be x=
[2791240.00s] 8 ah yeah square of
[2796280.00s] i. Square of i. Let's see if I can do
[2798560.00s] it. Should be <unk>2 / 2 * 1 +
[2804200.00s] i. And then this one is just
[2809079.00s] the square<unk> of i is going to be
[2812000.00s] <unk>2 over two * 1 minus
[2815880.00s] i. And then we have all our old
[2819000.00s] guys.
[2822520.00s] Uh oh. And then I can write plus or
[2824960.00s] minus in front of each of these. It's
[2826560.00s] like there weren't enough terms there.
[2827920.00s] Okay. Now I've got eight. Sorry, I've
[2829760.00s] got four numbers here and I've got four
[2831760.00s] numbers there. How in the world could I
[2834400.00s] remember this? Maybe I memorized it. No,
[2836720.00s] I didn't memorize it. It's actually
[2838079.00s] really easy to figure this out if you
[2841599.00s] know
[2843079.00s] geometry. Geometry. Let's do geometry
[2846960.00s] over
[2855319.00s] here. It's convenient. I'm actually a
[2857599.00s] geometer.
[2859079.00s] Uh
[2862280.00s] so you know complex numbers have two
[2864880.00s] parts right the real part and the
[2866400.00s] complex part. I'm going to draw that in
[2868640.00s] what's called the complex plane where we
[2870800.00s] draw the real part here and I guess it's
[2874000.00s] usually called the imaginary part on the
[2876079.00s] y- ais. Every point in this plane is a
[2879200.00s] complex number and vice versa. They're
[2880720.00s] the same thing.
[2883400.00s] Okay. So what did we start with? We
[2886079.00s] started with the number one. number
[2889800.00s] one uh would be here. It has no
[2893040.00s] imaginary part. So it's on the x- axis.
[2895200.00s] That's this is the real line down here.
[2897200.00s] And it's at position one, which I'm
[2898800.00s] going to just define to be right there.
[2901520.00s] Okay. Then we got negative 1. That's
[2903200.00s] over here. Then we got i. That's here. 1
[2908079.00s] * i. Then we got negative i. That's
[2911480.00s] here. H. Then we got <unk>2 over 2 * i +
[2915839.00s] 1. That's
[2919400.00s] here <unk>2 over2 by<unk>2 over2 what is
[2923359.00s] the property of <unk>2 over2 comma
[2926079.00s] roo<unk>2 over2 it has distance exactly
[2928640.00s] one to the origin right if I draw this
[2931839.00s] triangle <unk>2 /
[2934280.00s] 2 <unk>2 /2 uh I square this I get a
[2938720.00s] half I square this I get a half I add
[2941040.00s] them together I get one take the square
[2943359.00s] root I still get one so this distance is
[2946480.00s] H interesting. Uh and then I got the
[2949200.00s] negative of that which is over here and
[2951359.00s] negative of that. And then this is the
[2953920.00s] with a negative I get it wrong. Yep.
[2957960.00s] Sorry. Doesn't matter. But I'll think of
[2961440.00s] it as I
[2964040.00s] minus killer shock. I
[2968599.00s] minus one. It's the same cuz I had the
[2971599.00s] plus and minus, but I like the geometry.
[2974240.00s] So this point is
[2976920.00s] uh <unk>2 /2 by <unk>2 over2 and then
[2980640.00s] there's a negative over
[2983000.00s] here. What properties do these points
[2989640.00s] have? I heard a word. Circle. Unit
[2996680.00s] circle. Good. Who said unit circle?
[3001000.00s] Nice. It's a unit circle, right? Clearly
[3004240.00s] that deserves a frisbee
[3007079.00s] end.
[3009000.00s] Okay. Unit circle.
[3012280.00s] H
[3013960.00s] circle. It seems good. Uh what's going
[3017680.00s] on here
[3021000.00s] is I took this number. I claimed it was
[3024880.00s] the square root of I because it turns
[3028640.00s] out if you take points on the unit
[3030079.00s] circle in the complex plane when you
[3032000.00s] square a number it's like doubling the
[3034480.00s] angle relative to the x ais. This is
[3036559.00s] angle 0. This is angle what do you call
[3039119.00s] it? 45°. Uh this is angle 90°. So when I
[3043119.00s] square this number I get 90°. That's why
[3045839.00s] this number is a square sorry is a
[3048240.00s] square root of I. I probably should have
[3050400.00s] labeled some of these. This is I.
[3053280.00s] This is minus I. This is minus
[3056440.00s] one. And this is
[3059319.00s] one. In
[3061240.00s] general, we get
[3064599.00s] something called
[3067800.00s] uh
[3070359.00s] yeah. So let's these are called the nth
[3074160.00s] roots of
[3078040.00s] unity. Unity is just a fancy word for
[3081040.00s] one.
[3082800.00s] uh one is here and first we computed the
[3086480.00s] square roots of one they were minus one
[3088160.00s] and one then we compute computed the
[3090720.00s] fourth roots of one all of these numbers
[3094240.00s] if you take the fourth roots or sorry if
[3096480.00s] you take the fourth power you get one
[3099520.00s] then we computed the eighth roots of one
[3102160.00s] all of these numbers if you take the eth
[3104400.00s] power you get one again so in general
[3106960.00s] nth roots of
[3108200.00s] unity we're going to assume n is a power
[3110400.00s] of two but this notion actually makes
[3111920.00s] sense for any n and they're just
[3114480.00s] uniformly spaced around the circle. And
[3116160.00s] if you know some geometry and how it
[3118559.00s] relates to trig, you know that a general
[3120480.00s] point on the circle is cos theta comma
[3124000.00s] sin theta. x coordinate is cos theta, y
[3126720.00s] coordinate is sin theta. This is also a
[3128319.00s] funny notation for complex numbers. Not
[3130160.00s] so funny. This is the geometric
[3132160.00s] interpretation of uh cos theta uh plus i
[3138720.00s] sin
[3140359.00s] theta. Okay. Okay. And if I want them
[3142319.00s] uniformly spaced around the circle and I
[3144160.00s] want to include this point also known as
[3147359.00s] theta= 0 because when theta equals 0 cos
[3150800.00s] theta is 1 sin theta is 0 right uh then
[3154960.00s] so I want to say for theta
[3158800.00s] = to 0 and then
[3162200.00s] uh here I'm going to get fancy tow over
[3165640.00s] n 2 to
[3169400.00s] n up to uh n -1 / n * t to what's
[3175319.00s] tow 2 pi. Thank
[3179559.00s] you. This is modern notation just over
[3183280.00s] the last couple years. I believe in tao
[3185359.00s] so much I got it tattooed on my
[3188119.00s] arm. Okay, towel is is the fundamental
[3191599.00s] constant. Screw pi. Uh none of that
[3194880.00s] three and change. Six and change is
[3197119.00s] where it's at. Uh so toao clearly this
[3201760.00s] is much nicer tao over n not 2 pi / n.
[3204800.00s] Tao is a whole
[3206839.00s] circle. Okay this is 1 nth of a circle 2
[3210720.00s] of a circle n minus one over n of a
[3212880.00s] circle. I didn't do n of a circle
[3214559.00s] because that's also the same as
[3216680.00s] zero. Okay.
[3221160.00s] Now why
[3223880.00s] uh why did I introduce this notation?
[3227280.00s] Because there's this other great thing
[3229599.00s] called Orther's formula
[3233119.00s] uh which is that this this equals e to
[3238240.00s] the i
[3241559.00s] uh
[3244680.00s] theta right double
[3248520.00s] check it's so rare that I get to do real
[3252240.00s] uh calculus this is oiler's formula e e
[3255599.00s] for oiler another number two and change
[3258640.00s] uh e to the i this is funny because it's
[3261040.00s] complex time theta is equal to cos theta
[3263520.00s] plus i sin theta this is the relation
[3265599.00s] between exponentials and trigonometry
[3268960.00s] that's big thing oiler did cool uh so
[3273359.00s] what because this lets us understand how
[3276160.00s] squares
[3277559.00s] work not squares the shape
[3280599.00s] but squares the operation
[3290640.00s] when I take squares
[3294359.00s] uh so if I take e to the i theta this is
[3298640.00s] uh one of my roots of unity let me let
[3300559.00s] me expand out what theta is so theta is
[3304079.00s] some k * n let's do it this way first so
[3309359.00s] in reality we have uh k power /
[3314280.00s] n. When I square it, that's the same
[3317680.00s] thing as putting the two right here.
[3319839.00s] This is the same thing as e to the i * 2
[3323480.00s] thet. Bingo. I get what I was claiming
[3326000.00s] that if I start at some angle theta
[3328240.00s] relative to the xaxis, when I square the
[3330960.00s] number, I just double the angle. This is
[3334200.00s] why. Okay, this is obvious. uh and just
[3337839.00s] from regular algebra and then this thing
[3340559.00s] oilers's formula tells me that
[3342480.00s] corresponds to doubling the angle on a
[3345200.00s] circle. So only works for points in a
[3346800.00s] circle but uh so when I go here I get
[3349839.00s] you know e to the i k
[3353680.00s] uh I guess 2 k
[3356799.00s] * n twice as far around the
[3361000.00s] circle. All right. Uh
[3365480.00s] fine. What happens if I take this number
[3368720.00s] and I square it? So this has a really
[3371440.00s] big angle. This is uh it's 1/2 + 1/8
[3375839.00s] whatever that is 5/8
[3379559.00s] * when I double that angle I
[3384520.00s] go to here.
[3387240.00s] Right? Now, this you might call it 10/8
[3391280.00s] or you might also call it one quarter.
[3394240.00s] So, there's a because when you go around
[3396160.00s] the circle, you stay on the circle. So,
[3398000.00s] there's another thing going on which is
[3399520.00s] really um this is e to the i * 2
[3404680.00s] theta mod to usually we think of mods
[3408720.00s] relative to integers. But, uh the what I
[3412000.00s] mean is every time I add a multiple of
[3413520.00s] town, nothing changes. If I go around
[3415040.00s] the circle five times and then do
[3416559.00s] something, it's the same as just doing
[3417839.00s] the something. Okay, so I kind of need
[3420280.00s] that. Um, and this is true because uh e
[3424720.00s] to the i
[3426599.00s] tow= 1. You may know it as e to the i pi
[3431440.00s] = 1, but clearly this is the superior
[3433839.00s] formula. So superior I got it tattooed
[3436480.00s] on my other arm.
[3439640.00s] Uh, it's amazing what you can do with a
[3442000.00s] laser printer and a temporary tattoo
[3443680.00s] kit. Sadly, these won't last,
[3447000.00s] but definitely try it at home.
[3450440.00s] Um, cool. So, e to the i to equals 1.
[3455119.00s] So, going around the circle, same thing
[3457440.00s] is not. All right. So, uh you can draw
[3461040.00s] on this picture for every number what is
[3462720.00s] its square. Um, and in general, if you
[3466079.00s] look at these four guys, their squares
[3468640.00s] are just going to be these two guys. If
[3470240.00s] you look at these four guys, their
[3472079.00s] squares are going to be among these four
[3474079.00s] guys. So, I started with eight guys. I
[3476559.00s] square them, I get four. I square them,
[3478000.00s] I get two. I square them, I get one.
[3479599.00s] That's how we constructed it. Uh, but
[3481599.00s] you can see it works not only for this
[3484480.00s] eight point set that we constructed sort
[3486079.00s] of by hand. Uh, but it works for the nth
[3489119.00s] roots of unity. As long as n is a power
[3491200.00s] of
[3492200.00s] two, this set of points will be
[3496359.00s] collapsing. Okay. So, uh if n is a power
[3500799.00s] of two for some integer k, then uh nth
[3505440.00s] roots of
[3510119.00s] unity are collapsing.
[3522160.00s] according to this
[3523640.00s] definition and that's what we want. Then
[3526799.00s] this divide and conquer algorithm runs
[3528720.00s] in n log n time because every time we
[3531280.00s] square the set x we reduce its size by a
[3534160.00s] factor of two. So we get t of n= 2 * t
[3537040.00s] of n /2 + n plus order n and that's
[3539839.00s] order n log n. And so this whole thing
[3543760.00s] we compute in other words we set x k to
[3547359.00s] be um e to the i k to / n. Now guess I
[3554559.00s] should say how to compute that but let's
[3556240.00s] just say that's given to you for free.
[3558480.00s] It takes constant time to compute each
[3560720.00s] root of unity. In fact we again we only
[3562799.00s] need to do this once and for all uh for
[3565599.00s] each value of n. So you can think of it
[3567760.00s] as just being part of the algorithm.
[3569599.00s] These are the xks we use. I said x k
[3572000.00s] could be anything we want as long as
[3573359.00s] they're all different. So I'm going to
[3574880.00s] choose them to be n uniformly spaced
[3577359.00s] points around the complex unit circle.
[3581839.00s] And then magically this algorithm runs
[3584799.00s] in n log n time. It's pretty cool. Uh
[3589119.00s] intuitively you think of real numbers x
[3590880.00s] squ of course it has the same size as x.
[3594400.00s] But once you go to complex numbers,
[3596559.00s] there's this nifty trick where you start
[3598640.00s] with one nth of the circle and uniformly
[3602000.00s] spaced points after the first level of
[3603520.00s] recursion, you'll only have to be
[3605200.00s] dealing with n over two of those points,
[3607040.00s] namely the even ones, also known as the
[3609280.00s] n /2 roots of unity. And after the next
[3612079.00s] level of recursion, it's the n over
[3613280.00s] fourth roots of unity, and so on. So
[3614960.00s] this recursion is well defined. When you
[3617200.00s] have a vector of size n, you just have
[3619200.00s] to deal with the nth roots of unity, and
[3621200.00s] you're happy.
[3625760.00s] That is fast for a transform. That
[3628480.00s] algorithm with these xis is
[3632760.00s] fft. So let me write this
[3643559.00s] somewhere. It kind of snuck up on us.
[3646079.00s] This is the algorithm we were aiming to
[3648559.00s] to
[3649720.00s] find fast fora transform
[3660960.00s] uh
[3663240.00s] is that divide and conquer algorithm on
[3665839.00s] the
[3671720.00s] right. I'll write it abstractly. uh for
[3675119.00s] something called the DFT. It's the
[3677359.00s] discrete 4A
[3684200.00s] transform is the corresponding
[3686480.00s] mathematical
[3688520.00s] transformation. Fast is about an
[3690400.00s] algorithm. Discreet is about discrete
[3693599.00s] math. Uh so
[3696200.00s] DFT is uh this thing that we wanted to
[3699760.00s] compute which was basically the product
[3702319.00s] V * A
[3704920.00s] Remember V was the Vanderbond matrix. Uh
[3708000.00s] but and it was a it depended on all
[3709839.00s] these X Ks. Uh and we're going to set X
[3714480.00s] K to be this E to the I K to /
[3722359.00s] N. So uh if you remember the uh v k vj k
[3730000.00s] here was uh xj to the kth power. So this
[3735280.00s] just becomes uh e to the i j k to over
[3742359.00s] n. Uh it's a little funny these are all
[3745599.00s] consecutive because this is totally
[3747280.00s] different. But
[3749280.00s] uh that's the matrix. If you take that
[3753400.00s] matrix times a vector that is called the
[3755920.00s] discrete 4a transform of that vector and
[3758960.00s] fft is a way to comput it in n log n
[3761520.00s] time you just run this algorithm and for
[3763680.00s] those x ks it'll just work in n login
[3768119.00s] time. Cool. But if you remember way back
[3771760.00s] to the beginning what we needed is a way
[3774160.00s] this converts a coefficient vector into
[3776480.00s] a sample vector. Then we can multiply
[3780079.00s] the matrices. But we then need to trans
[3782720.00s] sorry multiply the polomials. Then we
[3785200.00s] need to transform the sample vector that
[3787040.00s] results back into a coefficient vector.
[3789839.00s] So we're only half done. I only have 15
[3793280.00s] minutes. Luckily the other half is
[3795280.00s] almost identical to this half. So let's
[3798079.00s] do that next. Uh maybe over
[3807000.00s] here. So we've got our great divide and
[3809680.00s] conquer algorithm. What we need now, let
[3812960.00s] me give you the polomial multiplication
[3817480.00s] algorithm. All right, let's call
[3819799.00s] this more exotic fast polomial
[3823319.00s] multiplication. Fast meaning n
[3827720.00s] login. Let's say that we're given two
[3831559.00s] uh polomials a and b represented in
[3835599.00s] coefficient
[3839799.00s] form. What we need uh is I'll call a
[3844680.00s] star which is the result of running fft
[3848000.00s] on a or it's the it's the discrete 4a
[3851359.00s] transform of a b star
[3855280.00s] uh do the same thing. So we know what
[3858400.00s] this means is convert A from a
[3861119.00s] coefficient vector into a sample vector.
[3863119.00s] Convert B from a coefficient vector into
[3865440.00s] a sample vector. Now I have the samples
[3867039.00s] of A star at the nth roots of unity,
[3871839.00s] these
[3874119.00s] guys. And I have the the samples of B at
[3877200.00s] the exact same points, the nth roots of
[3879359.00s] unity. So I can compute C star the the
[3883920.00s] transformed version the the DFT of C is
[3887520.00s] just the uh I mean C star K equals A*
[3893880.00s] K time B star K this is the
[3896480.00s] multiplication algorithm
[3898920.00s] uh for sample vectors right we started
[3901599.00s] with that that has that's linear time
[3904000.00s] and then the missing piece is I need to
[3906640.00s] recmp compute C which is the inverse
[3909440.00s] first fast forier transform of C
[3916920.00s] star. So this is the missing link so to
[3920799.00s] speak. We need to be able to go
[3921920.00s] backwards in this
[3927290.00s] [Applause]
[3931880.00s] transformation. Good news is the
[3934640.00s] algorithm is not going to change. What
[3936880.00s] we're computing isn't going to change.
[3939480.00s] uh all that's going to change are the x
[3944280.00s] ks.
[3945799.00s] Why? Because
[3948559.00s] uh remember uh from the top what right
[3951200.00s] now we know how to compute v * a. What
[3953680.00s] we now need to compute is v inverse time
[3956200.00s] a. So the only question is what is v
[3959480.00s] inverse? This matrix has a super special
[3962720.00s] structure. It's symmetric looks lots of
[3964960.00s] crazy lots of points on a circle. Maybe
[3967760.00s] V inverse has a nice structure and it
[3971960.00s] does. The claim
[3975079.00s] is V inverse is V complex conjugate
[3982400.00s] divided by
[3983799.00s] N. Uh what's complex conjugate? Uh for a
[3987680.00s] geometer it's reflection through the
[3989200.00s] X-axis. for an algebraic
[3992599.00s] person a + i. The complex conjugate is a
[3997359.00s] minus
[3998760.00s] i. Okay, so just apply that to every
[4001680.00s] entry in the matrix and then divide all
[4004319.00s] the entries by n, you get the
[4009240.00s] inverse. Cool. Very cool. because uh
[4013760.00s] what this tells us is we run exactly the
[4016640.00s] same algorithm and do exactly the same
[4020280.00s] transformation. If we want to do V
[4022799.00s] inverse, we can actually just use V but
[4025920.00s] with a different choice of X K. Namely,
[4029960.00s] um for the inverse, call it XK inverse.
[4035240.00s] uh we just take the complex conjugate of
[4039440.00s] this thing which turns out to be um e to
[4045880.00s] the
[4047400.00s] minus i j k to / n and then divide the
[4053039.00s] whole thing by
[4055240.00s] n. Okay, I'm using a fact here which is
[4058160.00s] that the complex conjugate of this
[4060599.00s] number is actually just you put a minus
[4063680.00s] sign here. Why does that hold? Because
[4066520.00s] geometry, right? If you uh theta is
[4070000.00s] usually measuring the counterclockwise
[4072119.00s] angle from the x-axis. If you take the
[4075520.00s] complex conjugate, you go from up here
[4077839.00s] to down here, the reflection through the
[4080160.00s] x-axis. That's the same thing as if you
[4081680.00s] measure theta as a clockwise angle from
[4084559.00s] the x-axis. So that's the same thing as
[4086079.00s] negating the angle. Okay, so that's just
[4088319.00s] a little geometry. You can prove it
[4090079.00s] algebraically, although I don't know how
[4092400.00s] uh off hand. It's not not hard. Uh so if
[4096400.00s] I want to take some angle and then flip
[4098640.00s] it through the x-axis, it's the same as
[4100640.00s] the negative of the angle. So complex
[4102480.00s] conjugate of this number is same thing
[4105679.00s] with a minus sign. And then we have to
[4107440.00s] divide by n. If I just
[4110120.00s] uh did I lie?
[4114719.00s] uh I can't divide by n. Sorry, it's in
[4117440.00s] the wrong spot. I use these x
[4120279.00s] ks and then uh I apply the transform. I
[4123920.00s] take this uh thing. I get not quite v
[4127359.00s] inverse, but I end up getting nv
[4129120.00s] inverse. I multiply that by my
[4132679.00s] aar. That's going to give me n *
[4136359.00s] a. Okay.
[4141239.00s] Uh so uh then I just take that vector I
[4144560.00s] divide by n boom I've got the inverse
[4146400.00s] transform. So this is how you do uh
[4149319.00s] inverse fast forier
[4152199.00s] transform. You just flip the sign in the
[4154560.00s] exponent in the x ks. Then you do the
[4157759.00s] same uh matrix vector product and then
[4160480.00s] you divide by n and then you've done the
[4162319.00s] inverse. So that's how you do uh if you
[4164880.00s] believe this claim that's how you do
[4166159.00s] this last step. Question. What's the J
[4168400.00s] and the X K? Oops. No J.
[4172040.00s] Sorry. Uh, I was imagining the these
[4175799.00s] guys. Yeah, it's just K. Thank
[4179640.00s] you. Other
[4182359.00s] questions? Okay. So, what remains is to
[4185440.00s] prove this
[4187239.00s] claim. Okay. Are you happy if I uh I
[4191759.00s] should probably have better Well,
[4194920.00s] anyway, it's not the best. I'm going to
[4197760.00s] call this uh VK prime X K prime. Then
[4201760.00s] when I do that, when I plug that in, I
[4203440.00s] get a different matrix V prime. And what
[4207040.00s] I'm claiming, what this claim says is
[4209840.00s] that V prime is equal to N * V inverse.
[4216080.00s] Okay, so I apply the same f of t
[4218080.00s] algorithm but with v prime instead of v.
[4221280.00s] Then I get not quite the product I want
[4223280.00s] but just n times the product I want.
[4225199.00s] Divide every term by n and we get the
[4228360.00s] inverse. This cool thing about complex
[4230719.00s] numbers here we get another cool thing.
[4233600.00s] All right. Uh but we have to prove this
[4235440.00s] claim. So let's do a little bit of
[4237360.00s] algebra. No pain no gain, right?
[4241080.00s] Uh good.
[4245880.00s] So, uh, let's look at VJ K
[4251560.00s] prime.
[4254120.00s] So, oh,
[4256720.00s] [Applause]
[4263800.00s] sorry. So, let's
[4266120.00s] uh
[4268679.00s] fine. Let's look at P the product of V
[4272480.00s] and V complex conjugate. Okay, what I
[4275920.00s] was calling V prime up there. Uh, I
[4278800.00s] claim that this thing is N times the
[4282159.00s] identity matrix with ones down the
[4284159.00s] diagonal and zeros everywhere else.
[4286560.00s] Okay, so let's look at this product in
[4289199.00s] general. Let's look at the uh say the j
[4292600.00s] kith item in the product that's going to
[4296080.00s] come from row j of v uh dotproduct with
[4302760.00s] column k of the complex conjugate. Now
[4308159.00s] the matrices here are symmetric so
[4309600.00s] actually rows and columns are the same
[4310880.00s] but that's the general definition of the
[4313120.00s] cell in the product of two matrices.
[4316640.00s] Uh so let's write it out as a
[4320199.00s] summation. We
[4322600.00s] have from m equals z. It's so hard not
[4325600.00s] to use i for my summations. It's the
[4328159.00s] only class I have to do it because I is
[4329679.00s] already taken but I guess I still use
[4331520.00s] capital i. But uh we'll use m i is
[4336159.00s] complex number today. Uh so we have um e
[4340239.00s] to the i t to j m /
[4347239.00s] n time e to the minus i to m k / n. I
[4356159.00s] don't know why I changed the order. I
[4358080.00s] put the towel here instead of there, but
[4359679.00s] same thing.
[4362400.00s] Okay, this is just the for every uh
[4365679.00s] position m in the cell and corresponding
[4367679.00s] position m in sorry m in the row
[4370239.00s] corresponding position m in the column I
[4372560.00s] have j m and I have m k again the order
[4376560.00s] doesn't matter it's symmetric but I'm
[4378320.00s] getting it right here this is we're
[4380719.00s] using this
[4382199.00s] formula okay I put a minus sign here
[4385280.00s] because this is the comp the complex
[4388280.00s] conjugate okay so now I just do some
[4390560.00s] algebra these share a lot they share I
[4393440.00s] they share
[4395560.00s] M and they share the divided by
[4399159.00s] N. Okay so this is sum M = 0 N -1 E to
[4407760.00s] the I oh they also share tow uh
[4411640.00s] to M /
[4414040.00s] N
[4415960.00s] times J minus K.
[4420080.00s] Please correct me if I make any
[4421400.00s] mistakes. Uh, cool. So, it depends how J
[4425280.00s] and K relate, of course. Um, if J equals
[4429600.00s] K, that's also that's also known as
[4432560.00s] something on the diagonal. I want this I
[4434560.00s] want the matrix
[4436120.00s] N 0 0, right? So, J equals K. That's the
[4441120.00s] diagonal. That's where I want to get N.
[4442560.00s] And indeed, if J equals K, this becomes
[4444800.00s] zero. So, all this becomes zero. E to
[4446880.00s] the 0 is 1. And so I'm summing up one n
[4451360.00s] times I get
[4452920.00s] n. Okay, cool. It's one case. This is n
[4457040.00s] if j equals k. And somehow I claim that
[4460800.00s] everywhere else I get
[4462520.00s] zeros. So let's prove that.
[4484000.00s] So
[4486199.00s] if J does not equal
[4489719.00s] K, I'm going to rewrite this a little
[4493320.00s] bit. J and K are
[4495640.00s] fixed. Okay, m is changing in the sum.
[4500239.00s] So I want to write this as sum m = 0 to
[4505360.00s] n minus
[4507640.00s] one e to the i to
[4514360.00s] uh j minus
[4516920.00s] k over n *
[4521080.00s] m. Okay, in other words, this thing
[4524880.00s] raised to the m
[4526440.00s] power. What is this series?
[4533440.00s] one word.
[4536080.00s] Geometric. Thank
[4540040.00s] you. This is a geometric
[4543000.00s] series and uh I guess I should have
[4545440.00s] waited uh to give you the Frisbee until
[4547840.00s] you tell me how do you solve a geometric
[4549600.00s] series of with a finite term. So think
[4552000.00s] of this as Z to the
[4554280.00s] M. Do you know the formula?
[4557679.00s] the i, just
[4561320.00s] zus one. Z to the n minus one almost zus
[4566320.00s] one over z minus one. Yep. That's if you
[4569280.00s] have sum of z to the k k= 0 to n minus
[4573520.00s] one. That's that. It's in the appendix
[4576159.00s] of your textbook. So we just plug that
[4578159.00s] in uh and we get uh oh boy e to
[4584600.00s] the better chalk e to the i tow j minus
[4590800.00s] k over
[4593080.00s] n to the n power minus one over e to the
[4599199.00s] i. Actually the denominator doesn't
[4600800.00s] really matter because this is supposed
[4602960.00s] to be zero. So it's all about the
[4605120.00s] numerator. Uh, so but it's the same
[4607440.00s] thing. Minus one.
[4612040.00s] Okay. Where's my red?
[4615400.00s] Red. The n cancels with the
[4619320.00s] n. This is an integer not equal to zero.
[4624159.00s] So we have e to the i tow to an integer
[4628040.00s] power. What's e to the i
[4631560.00s] towel? One. Okay.
[4635679.00s] convenient that I had that there. 1 - 1
[4638080.00s] is zero. So we get zero. Ah
[4642280.00s] satisfying. Okay. So that proves this
[4645840.00s] claim. We prove that on the diagonal we
[4648159.00s] get n because we had n copies of one.
[4650400.00s] Off the diagonal we get
[4652280.00s] zero like this. Therefore v complement
[4656159.00s] or sorry v complex conjugate time n is v
[4659679.00s] inverse. Therefore this algorithm
[4662000.00s] actually computes the inverse fastfora
[4663840.00s] transform.
[4666480.00s] So that's it for algorithms today. Um
[4669360.00s] but let me quickly tell you about some
[4671400.00s] applications. Uh you've probably taken
[4674000.00s] other classes that use applications of
[4675679.00s] fast for transform. So I will just
[4677239.00s] summarize. Uh if you've ever edited
[4680600.00s] audio, you probably did it in uh unless
[4685120.00s] you're just like pasting audio clips
[4687320.00s] together. Uh you probably did it in
[4689360.00s] what's called frequency space. So you
[4691679.00s] know that as I talked about in the
[4693199.00s] beginning when we're measuring where the
[4695440.00s] membrane on this microphone goes over
[4697120.00s] time that is in in the time domain for
[4700640.00s] every time we sample where physically
[4702880.00s] this thing is if you apply I think the
[4705679.00s] way I define it here it's the inverse
[4706880.00s] fastfora transform usually it's called
[4708480.00s] fora transform uh to that uh time domain
[4712400.00s] vector you get a new vector now it's a
[4716239.00s] complex vector so you start with real
[4718080.00s] numbers you get complex numbers so uh
[4720800.00s] For every uh position in the vector,
[4723840.00s] what it corresponds to the the x-axis is
[4726080.00s] no longer time. Now it's frequency. For
[4728560.00s] every frequency, you're measuring uh
[4731520.00s] essentially you're viewing this this
[4733120.00s] vector the waveform as a bunch of
[4736000.00s] trigonometric functions. Say s of
[4739120.00s] something time
[4740360.00s] theta. If you look at one of the entries
[4742719.00s] in the vector and it's a complex number,
[4744400.00s] if you compute the magnitude of the
[4745760.00s] complex number, the length of the vector
[4748080.00s] uh of the length of that two coordinate
[4749760.00s] vector that is how much
[4753199.00s] uh stuff of that frequency you have and
[4756080.00s] then the angle of the vector in 2D is uh
[4759360.00s] how that uh trigonometric function
[4761679.00s] shifted in time. So if you take a pure
[4765120.00s] note like if I was uh playing a bell and
[4768000.00s] it's exactly C major you uh you know it
[4771520.00s] looks it looks really wavy. It's
[4773280.00s] actually a nice perfect uh sign curve
[4776560.00s] with some offset depending on when I hit
[4778239.00s] it. Um and then if you apply the for
[4780880.00s] transform what you get is zeros
[4782080.00s] everywhere except for the one frequency
[4783920.00s] that's appearing and there you get one
[4786480.00s] and everywhere else you get zero. Well,
[4788880.00s] one possibly rotate it depending on the
[4791640.00s] phase. And you can take any audio
[4794880.00s] stream, convert it via 4A transform, do
[4797520.00s] manipulations there. For example, you've
[4799280.00s] probably heard of highp pass filters
[4800880.00s] that removes all the high frequencies or
[4802560.00s] low pass filters remove all the low
[4803920.00s] frequencies. You just convert to the
[4805440.00s] space, you zero out the parts you want,
[4807199.00s] and then you convert back with inverse
[4808640.00s] foraier transform. Uh if you've used
[4810640.00s] Adobe Audition or Audacity, they can all
[4812480.00s] do these things. Uh and there are tons
[4814880.00s] of contexts where converting to for
[4816640.00s] space makes life easy.
[4818480.00s] And in general, if you have any
[4819760.00s] timebased signal, you should always
[4821360.00s] think about what do you get with FFT
[4823440.00s] when you transform to uh frequency based
[4826320.00s] signal. And you can do lots of cool
[4828000.00s] things you couldn't do otherwise. And it
[4829360.00s] only takes an log and time plus people
[4831199.00s] do it in hardware. There's a fast
[4833040.00s] implementation called FFTW, the fastest
[4835440.00s] 4A transform in the west, which was made
[4837920.00s] here at MIT a bunch of years ago and is
[4840719.00s] still the best uh software
[4842320.00s] implementation of FFT. So people use it
[4844239.00s] everywhere. Uh, your head your noise
[4846719.00s] cancelling headsets probably use it. MP3
[4849120.00s] uses it. It's a cool algorithm.
