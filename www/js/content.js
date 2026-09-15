// Original activities aligned to the supplied Ganita Prakash, Grade 8, Part I.
// The route follows ideas, not a chronological claim about civilisations.
const choice=(id,title,prompt,options,answer,why,hint,visual)=>({id,type:'choice',title,prompt,options,answer,why,hint,visual});
const build=(id,title,prompt,target,weights,system,why,hint,extra={})=>({id,type:'build',title,prompt,target,weights,system,why,hint,...extra});
const roman=(id,target,why)=>({id,type:'roman',title:'Carve the code',prompt:`Write ${target} using Roman numerals. Tap the symbols in order.`,target,why,hint:'Start with the largest value that fits. For 4 and 9, use a smaller symbol before a larger one: IV, IX, XL, XC, CD, CM.'});
const trade=(id,title,base,counts,why)=>({id,type:'exchange',title,prompt:`Trade ${base} counters in a column for 1 counter in the next column to the left. Keep going until every column has fewer than ${base}.`,base,counts,why,hint:`Find a column with ${base} or more counters. Use its Trade button. A trade changes the representation, but keeps the total the same.`});

export const WORLDS = [
  {
    id:'pebbles',name:'Pebble Camp',topic:'The first counters',section:'3.1 · 3.2 I–III',pages:'48–57',color:'#8ecbb1',emblem:'tally',tag:'ONE OBJECT, ONE MARK',
    intro:'Before written digits, how could a herder know that every animal had come home? A little pebble could do a very big job.',
    lesson:'Match one pebble to each animal. Leftover pebbles tell you that animals are missing. Tally marks do the same job on a surface. Grouping marks makes a big collection easier to read.',
    takeaway:'Counting matches each object to exactly one item in a fixed sequence.',
    guide:'A number is a quantity. A numeral is a written representation of that quantity. People have counted using objects, ordered body parts, spoken names, and written symbols. In the Gumulgal examples, urapon means 1 and ukasar means 2; 5 is 2 + 2 + 1.',
    rounds:[
      {id:'p1',type:'tally',title:'Bring the herd home',prompt:'Tap each animal once to give it a pebble. Every animal needs its own counter.',count:7,why:'Seven animals, seven pebbles. This one-to-one match records the size of the herd without needing written digits.',hint:'Tap every animal. A tick means it already has its own pebble.'},
      choice('p2','The missing travellers','There were 8 animals at sunrise. These 6 returned. How many are missing?',['1','2','3','6'],'2','Match 6 returning animals to 6 of the 8 pebbles. The 2 pebbles left over stand for the 2 missing animals.','Pair each returned animal with one pebble. Count the pebbles left over.',{kind:'herd',count:6,pebbles:8}),
      choice('p3','Read the rock','How many objects do these tally marks record?',['9','10','12','15'],'12','Each bundle has 5 marks. Two bundles and 2 more give 5 + 5 + 2 = 12.','The diagonal stroke is the fifth mark in each bundle.',{kind:'tally',n:12}),
      build('p4','Make a tally','Record 17 baskets with tally marks.',17,[5,1],'tally','Three groups of 5 and 2 single marks represent 17. Grouping saves recounting every mark.','17 = 5 + 5 + 5 + 2.',{limits:[5,4],labels:['Groups of five','Single marks']}),
      choice('p5','Speak in pairs','In the Gumulgal pattern, what does ukasar–ukasar–urapon mean?',['3','4','5','6'],'5','Ukasar means 2 and urapon means 1. So this name means 2 + 2 + 1 = 5.','Read each ukasar as a pair and urapon as one.',{kind:'pairs',values:[2,2,1]}),
      choice('p6','The counting rule','Which method reliably counts a collection?',['Use a fixed order and count each object once','Count the largest objects twice','Change the number-name order each time'],'Use a fixed order and count each object once','One-to-one matching and a fixed order make a dependable counting system. Objects do not count more because they are bigger.','Each object should receive exactly one counter or number name.'),
      choice('p7','Camp guardian','12 pebbles and XII describe the same quantity. Which is a written numeral?',['XII','The collection of pebbles'],'XII','XII is a written numeral. A quantity can be represented in different ways, including a collection of objects.','A numeral is a written symbol or group of symbols.',{kind:'inscription',text:'12  ↔  XII'})
    ]
  },
  {
    id:'rome',name:'Roman Gate',topic:'Landmark numbers',section:'3.2 IV',pages:'58–61',color:'#e9a28d',emblem:'roman',tag:'SMALL SYMBOLS, BIG NUMBERS',
    intro:'A stone gate is covered in letters. They are numbers! Use Roman landmarks to read its messages and carve your own.',
    lesson:'I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1,000. Usually add from left to right. In the standard short forms, IV is 4 and IX is 9; XL is 40 and XC is 90.',
    takeaway:'Landmark numbers help us group quantities, but Roman landmarks are not powers of one fixed base.',
    guide:'Landmarks are reference values used to form other numbers. Roman numerals use 1, 5, 10, 50, 100, 500 and 1,000. This game uses standard subtractive spellings, such as XL for 40. The textbook also notes historical alternatives such as XXXX. Roman arithmetic requires different group sizes between landmarks.',
    rounds:[
      choice('r1','Read the gate','What value is carved on this gate?',['17','22','27','32'],'27','XXVII = 10 + 10 + 5 + 1 + 1 = 27.','X is 10, V is 5, and I is 1.',{kind:'inscription',text:'XXVII'}),
      roman('r2',14,'XIV = 10 + (5 − 1) = 14. The pair IV means 4.'),
      choice('r3','A change of order','Why is IX different from XI?',['IX is 9; XI is 11','Both are 11','IX is 11; XI is 9'],'IX is 9; XI is 11','I before X means subtract 1 from 10. I after X means add 1 to 10. This is not a positional base system.','Compare 10 − 1 with 10 + 1.',{kind:'inscription',text:'IX  ≠  XI'}),
      roman('r4',49,'XLIX = (50 − 10) + (10 − 1) = 40 + 9 = 49.'),
      roman('r5',302,'CCCII = 100 + 100 + 100 + 1 + 1 = 302. This numeral has no zero symbol.'),
      choice('r6','Combine the treasures','What is XII + VIII?',['XVIII','XX','XXII','XVI'],'XX','12 + 8 = 20. The answer is XX: two tens.','XII is 12 and VIII is 8.',{kind:'inscription',text:'XII + VIII'}),
      choice('r7','Gate guardian','Why are Roman landmarks not the powers of a single base?',['The multiplying step changes between 5 and 2','Roman numerals cannot represent 100','Every landmark is 10 times the last'],'The multiplying step changes between 5 and 2','1 → 5 multiplies by 5; 5 → 10 multiplies by 2. A base system uses the same multiplying step throughout.','Look at 1 → 5 → 10 → 50.',{kind:'sequence',values:['1','5','10','50','100']})
    ]
  },
  {
    id:'egypt',name:'Nile Workshop',topic:'Symbols & powers of ten',section:'3.3 I',pages:'61–62, 64–69',color:'#e8be73',emblem:'egypt',tag:'THE POWER OF TEN',
    intro:'The workshop needs a new scribe. Build numbers with strokes, heel bones, rope coils, and lotus flowers.',
    lesson:'A stroke is 1, a heel-bone arch is 10, a rope coil is 100, and a lotus is 1,000. Add the symbol values. Ten of one symbol can be traded for the next.',
    takeaway:'Egyptian numerals use powers of 10, but each landmark has its own symbol.',
    guide:'The Egyptian system shown here is additive and base 10. A symbol keeps its value when moved. Repeating a symbol ten times can be regrouped into one symbol for the next power of ten. This makes addition and multiplication easier, but representing ever-larger powers still needs new symbols.',
    rounds:[
      choice('e1','Meet the symbols','What is the value of this numeral?',['123','213','231','312'],'213','Two rope coils make 200, one arch makes 10, and three strokes make 3: 213.','Use the symbol key beneath the numeral.',{kind:'egypt',n:213}),
      build('e2','A scribe’s first tablet','Build 324 with Egyptian symbols.',324,[100,10,1],'egypt','3 hundreds + 2 tens + 4 ones = 324. Each symbol has its own fixed value.','Use 3 coils, 2 arches, and 4 strokes.'),
      build('e3','Leave out the empty group','Build 1,023. Do you need a hundred-symbol?',1023,[1000,100,10,1],'egypt','One lotus, no coils, two arches, and three strokes make 1,023. In this additive system, we simply leave out the unused symbol.','1,023 = 1,000 + 20 + 3.'),
      choice('e4','Shuffle the tablet','If you move a 100-symbol after the 1-symbols, what happens to its value?',['It stays 100','It becomes 1','It becomes 10'],'It stays 100','An Egyptian symbol has a fixed value. Its position does not change that value.','This system adds symbol values; it does not assign column values.'),
      trade('e5','Trade at the workshop',10,[0,15,15],'15 tens and 15 ones are 165. Trade 10 ones for 1 ten, then 10 tens for 1 hundred: 1 hundred, 6 tens, 5 ones.'),
      choice('e6','Multiply the cargo','What does multiplying this number by 10 produce?',['122','1,220','12,200','112'],'1,220','122 × 10 = 1,220. Each stroke becomes an arch, each arch a coil, and each coil a lotus.','Multiplying by 10 moves each symbol up one landmark.',{kind:'egypt',n:122}),
      choice('e7','Workshop guardian','What is a limitation of this Egyptian system?',['Bigger powers need new symbols','It cannot add numbers','It has no groups of ten'],'Bigger powers need new symbols','The system needs a new symbol for each larger power of ten. Place value will let us reuse the same symbols instead.','Think about how we would represent a new, much bigger landmark.')
    ]
  },
  {
    id:'bases',name:'Base Forge',topic:'Group, trade, repeat',section:'3.3 II',pages:'62–70',color:'#9baee4',emblem:'base',tag:'BUILD A NUMBER SYSTEM',
    intro:'What if we grouped things in fives instead of tens? Set the forge to a new base and discover what changes.',
    lesson:'A base is a fixed grouping size. In base 5 the landmarks are 1, 5, 25, 125… Each is five times the last. In a place-value version, the allowed digits are 0, 1, 2, 3, 4.',
    takeaway:'In base n, landmarks are 1, n, n², n³… and n of one place trade for one of the next.',
    guide:'The chapter first invents a base-5 additive system: triangle = 1, square = 5, hexagon = 25, circle = 125. Later it introduces positional writing. Both use powers of 5. Keep the idea of a base (the grouping size) distinct from place value (position gives a symbol its weight).',
    rounds:[
      choice('b1','Complete the landmarks','Which number comes next in this base-5 sequence?',['30','50','100','125'],'125','25 × 5 = 125. Each landmark is five times the one before.','Multiply 25 by 5.',{kind:'sequence',values:['1','5','25','?']}),
      build('b2','Forge a new numeral','Using the chapter’s shapes, build the decimal number 43.',43,[25,5,1],'shapes','1 hexagon + 3 squares + 3 triangles = 25 + 15 + 3 = 43.','Use one 25, then fit as many 5s as possible.',{limits:[4,4,4]}),
      trade('b3','The five-for-one machine',5,[0,6,8],'6 fives and 8 ones make 38. After regrouping: 1 twenty-five, 2 fives, and 3 ones. The quantity is unchanged.'),
      choice('b4','Spot a different base','Which landmarks belong to base 7?',['1, 7, 14, 21','1, 7, 49, 343','7, 10, 70, 100'],'1, 7, 49, 343','Start at 1 and multiply by 7 each time: 1, 7, 49, 343.','Landmarks are powers, not just consecutive multiples.'),
      choice('b5','Multiply landmarks','In base 5, 5 × 25 lands on which landmark?',['30','125','625','50'],'125','5 × 25 = 5¹ × 5² = 5³ = 125. Multiplying two powers of the base gives another power.','Five groups of twenty-five make one hundred and twenty-five.',{kind:'sequence',values:['5','×','25','?']}),
      trade('b6','An abacus carry',10,[2,9,4,10],'The board represents 2,907 + 43 = 2,950. Ten ones trade for one ten, giving 2 thousands, 9 hundreds, 5 tens and 0 ones.'),
      choice('b7','Forge guardian','A base-5 column already has four counters. What happens when you add one more?',['Trade five for one in the next column','Write the digit 5 in that column','The number stays the same'],'Trade five for one in the next column','Five counters fill a base-5 group. Trade them for one in the next column. This is the idea behind carrying.','Each base-5 digit must be less than 5.')
    ]
  },
  {
    id:'babylon',name:'Babylon Skywatch',topic:'The place-value breakthrough',section:'3.4 I',pages:'70–74',color:'#86bdd8',emblem:'babylon',tag:'POSITION CHANGES EVERYTHING',
    intro:'Under a starry sky, clay tablets hold a new idea: the same marks can mean ones, sixties, or three-thousand-six-hundreds.',
    lesson:'A vertical wedge means 1 and a corner wedge means 10 within a group. From right to left, the groups are weighted 1, 60, 3,600. Read each group, multiply by its place, then add.',
    takeaway:'In a place-value system, a symbol’s position tells you which landmark it belongs to.',
    guide:'Babylonian (Mesopotamian) numerals use base 60. A group contains a value from 1 to 59. Empty positions were initially left blank; a later placeholder helped with internal blanks, but was not normally used at the end. Without clear places, some numerals could have several interpretations. Our labelled columns remove that ambiguity for learning.',
    rounds:[
      choice('ba1','Read a clay mark','How much is this single group worth?',['12','21','22','32'],'22','Two corner wedges mean 20; two vertical wedges mean 2. Together they make 22.','A corner wedge is 10; a vertical wedge is 1.',{kind:'babylon',digits:[22],weights:[1]}),
      choice('ba2','The same mark, a new place','What value do these two groups represent?',['23','63','123','603'],'123','2 in the sixties place is 120. Add 3 ones to get 123.','Multiply the left group by 60.',{kind:'babylon',digits:[2,3],weights:[60,1]}),
      build('ba3','Write to the skywatcher','Build 132 using sixties and ones.',132,[60,1],'babylon','2 × 60 + 12 = 132. A group’s position determines its weight.','132 contains 2 full groups of 60, with 12 left over.',{limits:[59,59]}),
      choice('ba4','Decode a larger tablet','Read this tablet using the labelled positions.',['753','7,530','12,530','7,203'],'7,530','2 × 3,600 + 5 × 60 + 30 = 7,200 + 300 + 30 = 7,530.','Work from the largest place: 2 × 3,600.',{kind:'babylon',digits:[2,5,30],weights:[3600,60,1]}),
      build('ba5','The empty middle','Build 3,605. Leave the sixties position empty.',3605,[3600,60,1],'babylon','1 × 3,600 + 0 × 60 + 5 = 3,605. An empty position must be kept in its correct place.','One 3,600, no sixties, and five ones.',{limits:[59,59,59]}),
      choice('ba6','A mystery without labels','An early tablet has one wedge and no clear position or context. What can we conclude?',['It must be 1','It must be 60','Its value could be ambiguous'],'Its value could be ambiguous','The same mark could indicate 1, 60 or 3,600 depending on its place. Missing or unclear empty places create ambiguity.','What happens when the place labels disappear?',{kind:'babylon',digits:[1],weights:null}),
      choice('ba7','Skywatch guardian','Which everyday convention still reflects base 60?',['60 seconds in a minute','100 centimetres in a metre','7 days in a week'],'60 seconds in a minute','Our time divisions still show the influence of the sexagesimal, or base-60, tradition.','Think about seconds and minutes.')
    ]
  },
  {
    id:'maya',name:'Maya Steps',topic:'Dots, bars & a shell',section:'3.4 II',pages:'74–76',color:'#87c6b5',emblem:'maya',tag:'READ FROM THE GROUND UP',
    intro:'Climb a tower where numbers are stacked vertically. A dot, a bar, and a shell are all you need to read its messages.',
    lesson:'A dot is 1, a bar is 5, and a shell is 0. The lowest level is ones; above it are twenties, then 360s. This chapter uses an almost-base-20 system: the third place is 360, not 400.',
    takeaway:'The chapter’s Mayan places are 1, 20, 360, 7,200… Its shell marks an empty place.',
    guide:'Use the textbook’s convention: 1, 20, 20 × 18 = 360, then 7,200. Symbols are stacked vertically. A digit is built with up to four dots and three bars. For canonical writing in the first three places, the twenties level runs from 0 to 17 before carrying to the 360s level. The shell is zero.',
    rounds:[
      choice('m1','Read the stone','How much does this single level show?',['7','10','12','15'],'12','Two bars are 10 and two dots are 2: a total of 12.','Each bar is worth 5.',{kind:'maya',digits:[12],weights:[1]}),
      build('m2','Carve a number','Build 17 using dots and bars on one level.',17,[1],'maya','Three bars and two dots make 15 + 2 = 17.','Use the +5 and +1 controls to add bars and dots.',{limits:[19]}),
      choice('m3','Climb one level','Read this stack from the labelled places.',['14','29','49','209'],'49','2 × 20 + 9 × 1 = 49. The two upper dots are worth 40 because of their position.','The upper level counts twenties.',{kind:'maya',digits:[2,9],weights:[20,1]}),
      build('m4','A message for the summit','Build 77 in the Mayan system.',77,[20,1],'maya','3 × 20 + 17 = 60 + 17 = 77.','Three twenties leave seventeen ones.',{limits:[17,19]}),
      choice('m5','The surprising third step','Which is the third place value in the Mayan system used in this chapter?',['40','200','360','400'],'360','The chapter uses 1, 20, 360, 7,200… Since 20 × 18 = 360, this is not a pure base-20 system.','The second step multiplies by 18, not 20.',{kind:'sequence',values:['1','20','?','7,200']}),
      build('m6','The shell’s secret','Build 361. Keep the empty twenties level visible.',361,[360,20,1],'maya','One dot at 360, a shell at 20, and one dot at 1 give 361. The shell holds the empty middle place.','361 = 360 + 0 twenties + 1.',{limits:[19,17,19]}),
      choice('m7','Steps guardian','Decode the whole tower.',['1,660','1,820','411','1,440'],'1,660','4 × 360 + 11 × 20 + 0 × 1 = 1,440 + 220 + 0 = 1,660. The shell contributes zero.','Calculate the contribution of each labelled level.',{kind:'maya',digits:[4,11,0],weights:[360,20,1]})
    ]
  },
  {
    id:'china',name:'Rod Garden',topic:'A different kind of digit',section:'3.4 III',pages:'76–78, 80',color:'#d5a3c8',emblem:'rods',tag:'ONE DIGIT, MANY PLACES',
    intro:'Bamboo-like counting rods reveal another way to write numbers. Their direction helps keep neighbouring digits apart.',
    lesson:'Chinese rod numerals use base 10. Zong forms go in ones and hundreds; Heng forms go in tens and thousands. The forms alternate. An empty place was left blank.',
    takeaway:'Rod direction helps separate digits; place value still determines their contribution.',
    guide:'Zong forms use vertical strokes for 1–5, then a crossbar with 1–4 strokes for 6–9. Heng forms use horizontal strokes and an upright for 6–9. Ones, hundreds and ten-thousands use Zong; tens, thousands and hundred-thousands use Heng. Blank space represents an unused position.',
    rounds:[
      choice('c1','Two directions','These rod forms both represent which digit?',['2','3','5','6'],'3','Three vertical rods and three horizontal rods both represent the digit 3. Their place determines their contribution.','Count the rods in each form.',{kind:'rodPair',n:3}),
      choice('c2','Read the garden board','What number is on the board?',['243','234','324','432'],'234','2 hundreds + 3 tens + 4 ones = 234. The rod directions alternate across places.','Read the digit in each labelled column.',{kind:'rods',digits:[2,3,4],weights:[100,10,1]}),
      build('c3','Place the rods','Build 263 with counting rods.',263,[100,10,1],'rods','2 × 100 + 6 × 10 + 3 = 263. The tens digit uses the Heng form.','Two hundreds, six tens, three ones.'),
      choice('c4','A larger garden','Read this four-place number.',['2,634','2,364','6,234','2,643'],'2,634','2 thousands + 6 hundreds + 3 tens + 4 ones = 2,634.','Start at the thousands column.',{kind:'rods',digits:[2,6,3,4],weights:[1000,100,10,1]}),
      choice('c5','Why turn the rods?','Why alternate Zong and Heng forms?',['To distinguish neighbouring digits','To change base 10 into base 2','To make every rod worth 10'],'To distinguish neighbouring digits','Alternating orientation helps show where one digit ends and the next begins. It does not change the base.','Imagine many adjacent upright rods with no gap.'),
      build('c6','An empty patch','Build 204. What belongs in the tens place?',204,[100,10,1],'rods','2 hundreds, a blank tens place, and 4 ones give 204. Leaving out the place itself could make 24 instead.','The tens place contains no rods.'),
      choice('c7','Garden guardian','Which change makes empty places explicit in every position?',['Give zero its own digit','Remove the column spacing','Use more rods for 1'],'Give zero its own digit','A written zero marks an empty position clearly, including at the end. The Indian number system makes this idea central.','A blank can be overlooked. What could mark it?')
    ]
  },
  {
    id:'zero',name:'Zero Summit',topic:'Ten digits. Endless possibilities.',section:'3.4 IV · Summary',pages:'78–81',color:'#f0cd85',emblem:'zero',tag:'THE LITTLE DIGIT THAT CHANGED EVERYTHING',
    intro:'You have reached the final discovery. Ten familiar digits, the power of position, and a symbol for nothing unlock an endless world of numbers.',
    lesson:'The Indian (Hindu / Hindu-Arabic) system uses digits 0–9 with powers of 10. Zero holds empty positions and is also a number: adding zero changes nothing; multiplying by zero gives zero.',
    takeaway:'A finite set of digits can represent arbitrarily large whole numbers by adding more positions.',
    guide:'In 305, the zero says there are no tens, so 3 stays in the hundreds place. Zero is also a number in its own right. To write in another positional base, use that base’s powers and digits smaller than the base. For example, decimal 25 is 31 in base 8, 100 in base 5, and 11001 in base 2.',
    rounds:[
      build('z1','Put nothing in its place','Build 305 with decimal digits.',305,[100,10,1],'decimal','3 × 100 + 0 × 10 + 5 = 305. Zero keeps the hundreds and ones in their places.','Use a zero in the tens place.'),
      choice('z2','The disappearing zero','Delete the zero from 305 to make 35. What happens to the value of the digit 3?',['It changes from 300 to 30','It stays 300','It changes from 30 to 300'],'It changes from 300 to 30','The 3 moves from the hundreds place to the tens place. Removing a zero can change other digits’ place values.','Compare the place of 3 in each number.',{kind:'inscription',text:'305 → 35'}),
      choice('z3','Zero is a number, too','Which pair of statements is correct?',['42 + 0 = 42; 42 × 0 = 0','42 + 0 = 0; 42 × 0 = 42','Both answers are 42'],'42 + 0 = 42; 42 × 0 = 0','Adding nothing leaves 42 unchanged. Zero groups of 42 contain nothing. Zero works as a number, not only a placeholder.','Think of adding no objects, then taking zero groups.'),
      build('z4','What if we had eight fingers?','Write the decimal quantity 25 using base-8 places.',25,[8,1],'decimal','25 = 3 × 8 + 1. Its base-8 numeral is 31, which represents the same quantity as decimal 25.','Three groups of 8 leave one.',{limits:[7,7],base:8}),
      build('z5','The same quantity, base five','Write decimal 25 in base 5.',25,[25,5,1],'decimal','25 = 1 × 25 + 0 × 5 + 0. So decimal 25 is written 100 in base 5.','One twenty-five and two empty positions.',{limits:[4,4,4],base:5}),
      build('z6','Binary beacon','Turn the 0/1 switches into a base-2 representation of decimal 25.',25,[16,8,4,2,1],'binary','16 + 8 + 1 = 25. The switches read 11001 in base 2. Only digits 0 and 1 are needed.','Turn on 16, 8 and 1; keep 4 and 2 off.',{limits:[1,1,1,1],base:2}),
      choice('z7','Name the breakthrough','What lets ten digits represent larger and larger whole numbers?',['Reuse the digits in more positions','Invent a new digit for every number','Stop counting at 9,999'],'Reuse the digits in more positions','Position gives each digit a weight. Adding another place lets the same ten digits represent larger numbers.','Think about 9, 99, 999, 9,999…'),
      {id:'z8',type:'match',title:'The final constellation',prompt:'Match each discovery to the system in which you explored it.',rows:[
        {label:'I, V, X, L, C, D, M',answer:'Roman'},
        {label:'Powers of 10, each with its own symbol',answer:'Egyptian'},
        {label:'Place values 1, 60, 3,600',answer:'Babylonian'},
        {label:'A shell for zero; places 1, 20, 360',answer:'Mayan'},
        {label:'Alternating Zong and Heng rods',answer:'Chinese'},
        {label:'Digits 0–9, decimal place value, zero as a number',answer:'Indian'}
      ],options:['Roman','Egyptian','Babylonian','Mayan','Chinese','Indian'],hint:'Use the Field Guide if you need a reminder. Each description belongs to a different system.',why:'You have connected the whole story: counting, landmarks, bases, positions, and zero. Many cultures contributed powerful ideas to the way we represent numbers.'}
    ]
  }
];
export const TOTAL_ROUNDS = WORLDS.reduce((sum,w)=>sum+w.rounds.length,0);
