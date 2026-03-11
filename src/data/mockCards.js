export const MOCK_CARDS = [
  {
    id: 'card_001',
    unitId: 'unit_01',
    unit: 'Unit 1: Neural Signaling',
    topic: 'Action Potential: Ionic Basis',
    coreIdea:
      'Action potentials are self-regenerating electrical signals driven by sequential Na⁺ influx and K⁺ efflux, following an all-or-none principle. Signal strength is encoded by frequency, not amplitude — a critical distinction from graded potentials.',
    keyTerms: [
      { term: 'Threshold', definition: '−55 mV — the critical membrane potential at which AP initiation becomes inevitable' },
      { term: 'Voltage-gated Na⁺ channel', definition: 'Opens at threshold; m-gate activates rapidly, h-gate inactivates (refractory period)' },
      { term: 'Depolarization', definition: 'Na⁺ rushes in; membrane potential rises to +30 mV' },
      { term: 'Repolarization', definition: 'Delayed K⁺ channels open; K⁺ exits restoring negative charge' },
      { term: 'Hyperpolarization', definition: 'Membrane overshoots −70 mV; absolute then relative refractory period' },
      { term: 'Saltatory conduction', definition: 'AP jumps node-to-node in myelinated axons for speed and energy efficiency' },
    ],
    mechanism:
      '1. Resting state: −70 mV; Na⁺/K⁺ ATPase maintains gradient (3 Na⁺ out, 2 K⁺ in)\n2. Stimulus reaches threshold (−55 mV)\n3. Voltage-gated Na⁺ channels open → rapid depolarization to +30 mV\n4. Na⁺ channels inactivate (h-gate closes) → absolute refractory period begins\n5. Voltage-gated K⁺ channels open (delayed rectifier) → repolarization\n6. K⁺ channels slow to close → hyperpolarization to −80 mV (relative refractory)\n7. Na⁺/K⁺ ATPase pumps restore resting potential',
    clinicalTieIn:
      'Lidocaine blocks voltage-gated Na⁺ channels → prevents AP initiation (local anesthesia). Multiple sclerosis demyelinates axons → slows/blocks saltatory conduction → sensory & motor deficits. Hyperkalemia reduces K⁺ equilibrium potential → brings resting potential closer to threshold → spontaneous firing → cardiac arrhythmia.',
    professorEmphasis:
      'Dr. Chen consistently emphasizes the h-gate inactivation mechanism (why APs are unidirectional and why the refractory period is mandatory). She draws the Hodgkin-Huxley conductance curves every lecture. Key phrase: "The channel is both sensor and effector." Expect clinical application of Na⁺ channel blockers.',
    memoryHook:
      'DEPORE: Depolarize (Na⁺ in), Overshoot (+30 mV), Potassium Out, Refract, Equilibrate. Think: Na⁺ rushes in like a panicked student, K⁺ shuffles out like a slow janitor. The h-gate = the bouncer that kicks Na⁺ channels out after the party.',
    likelyExamQuestion:
      'A patient with severe hyperkalemia (K⁺ = 7.2 mEq/L) presents with muscle weakness and cardiac arrhythmia. Using ionic mechanisms, explain how elevated extracellular K⁺ leads to spontaneous neuronal firing.',
    likelyExamAnswer:
      'Elevated extracellular K⁺ reduces the K⁺ equilibrium potential (less negative per Nernst equation), which depolarizes the resting membrane potential. With resting potential closer to threshold (−55 mV), neurons require minimal or no additional stimulus to fire. This spontaneous excitability leads to muscle weakness (paradoxically, from sustained depolarization and Na⁺ channel inactivation) and disrupts cardiac pacemaker timing.',
    quizLikelihood: 92,
    pinned: false,
    tags: ['ionic-channels', 'signaling', 'pharmacology', 'clinical'],
    sourceReferences: ['src_quiz_midterm1', 'src_transcript_week2', 'src_syllabus'],
    createdAt: '2026-03-01T00:00:00Z',
    studyModeVariants: {
      professorWording: {
        topic: 'Hodgkin-Huxley Model & Clinical Consequences',
        coreIdea:
          'When Dr. Chen says "the channel is both sensor and effector," she means voltage-gating couples the trigger to the response — depolarization opens the very Na⁺ channels that amplify it further. Think in conductance curves: gNa peaks fast, gK rises slow — the temporal offset IS the action potential shape.',
        mechanism:
          'Focus on the h-gate: it is the mechanism that enforces unidirectionality. Na⁺ channels cannot reopen until h-gate resets. This is the refractory period. No h-gate reset = no second AP from the same patch of membrane = the AP can only go forward.',
      },
      examCram: {
        oneLineSummary:
          'Na⁺ in → depolarize to +30 mV; h-gate closes Na⁺; K⁺ out → repolarize; all-or-none, frequency-coded.',
        mustKnow: [
          'Threshold = −55 mV; resting = −70 mV',
          'Na⁺ channels: m-gate (fast activation), h-gate (inactivation = refractory)',
          'K⁺ channels: delayed rectifier, slow → hyperpolarization overshoot',
          'Hyperkalemia → resting potential closer to threshold → spontaneous firing',
          'Lidocaine = Na⁺ channel blocker (local anesthetic)',
          'MS = demyelination → slowed saltatory conduction',
          'AP is all-or-none; frequency = signal intensity',
        ],
      },
    },
  },
  {
    id: 'card_002',
    unitId: 'unit_02',
    unit: 'Unit 2: Synaptic Transmission',
    topic: 'Synaptic Vesicle Cycle & Neurotransmitter Release',
    coreIdea:
      'Neurotransmitter release is a Ca²⁺-triggered, SNARE protein-mediated process of vesicle exocytosis. Action potential arrival opens Ca²⁺ channels; Ca²⁺ binds synaptotagmin; SNARE complex zippers to fuse vesicle with presynaptic membrane, releasing neurotransmitter into the cleft.',
    keyTerms: [
      { term: 'SNARE complex', definition: 'Synaptobrevin (v-SNARE) + syntaxin + SNAP-25 (t-SNAREs) — the fusion machinery' },
      { term: 'Synaptotagmin', definition: 'Ca²⁺ sensor on vesicle; Ca²⁺ binding triggers SNARE complex zippering' },
      { term: 'Voltage-gated Ca²⁺ channel', definition: 'P/Q-type at active zone; Ca²⁺ influx is the release trigger' },
      { term: 'Quantal release', definition: 'NT released in discrete packets (quanta) = one vesicle content' },
      { term: 'Endocytosis', definition: 'Clathrin-mediated retrieval of vesicle membrane after exocytosis' },
      { term: 'Active zone', definition: 'Presynaptic density where vesicles dock and release is focused' },
    ],
    mechanism:
      '1. AP invades presynaptic terminal\n2. Voltage-gated Ca²⁺ channels (P/Q-type) open\n3. Ca²⁺ influx (~200 µM local concentration near active zone)\n4. Ca²⁺ binds synaptotagmin → conformational change\n5. SNARE complex zippers (synaptobrevin + syntaxin + SNAP-25)\n6. Vesicle membrane fuses with presynaptic membrane\n7. NT released into synaptic cleft (~0.5 ms after AP)\n8. NT diffuses to postsynaptic receptors\n9. Clathrin-mediated endocytosis recycles vesicle membrane\n10. Vesicle refilled with NT; cycle repeats',
    clinicalTieIn:
      'Botulinum toxin cleaves SNARE proteins (SNAP-25 or synaptobrevin) → prevents vesicle fusion → flaccid paralysis (therapeutic in dystonia, cosmetic use). Tetanus toxin cleaves synaptobrevin in inhibitory interneurons → disinhibition → spastic paralysis. Lambert-Eaton syndrome: autoantibodies against Ca²⁺ channels → reduced Ca²⁺ influx → decreased NT release → proximal muscle weakness (improves with repeated activity, unlike myasthenia).',
    professorEmphasis:
      'Dr. Chen draws the SNARE zipper diagram every time. She loves the botulinum vs tetanus toxin contrast as a "beautiful example of same mechanism, opposite clinical result." She expects you to name the specific SNARE proteins each toxin cleaves and explain the directional difference in paralysis type.',
    memoryHook:
      'SNARE = Synaptic Neurotransmitter And Release Engine. Botulinum = BOcking the toxin Clears Neuromuscular Activation (flAccid). Tetanus = Twisting inhibitory neurons → Excitatory dominance → Spastic. Remember: Botox makes things FLACCID (like Botox relaxing wrinkles), Tetanus makes you STIFF.',
    likelyExamQuestion:
      'Compare the mechanisms and clinical presentations of botulinum toxin and tetanus toxin poisoning. Why does the same molecular target (SNARE proteins) produce opposite clinical manifestations?',
    likelyExamAnswer:
      'Both cleave SNARE proteins but in different synapses. Botulinum acts at NMJ presynaptic terminals, cleaving SNAP-25 (types A, C) or synaptobrevin (types B, D, F) → blocks ACh release → flaccid paralysis. Tetanus toxin is transported retrogradely to spinal cord, cleaving synaptobrevin in glycinergic/GABAergic inhibitory interneurons → blocks inhibitory NT release → unopposed excitatory input → spastic paralysis and rigidity (lockjaw, risus sardonicus).',
    quizLikelihood: 88,
    pinned: false,
    tags: ['synapse', 'vesicle', 'toxins', 'snare', 'clinical'],
    sourceReferences: ['src_transcript_week3', 'src_slides_week3', 'src_quiz_midterm1'],
    createdAt: '2026-03-01T00:00:00Z',
    studyModeVariants: {
      professorWording: {
        topic: 'SNARE-Mediated Fusion: The Zipper Model & Its Toxins',
        coreIdea:
          'Dr. Chen\'s phrase: "Ca²⁺ is the trigger; synaptotagmin is the safety; SNARE is the gun." Visualize the zipper — synaptobrevin on the vesicle zips toward syntaxin on the plasma membrane, creating the force that overcomes membrane repulsion.',
        mechanism:
          'The key insight Dr. Chen emphasizes: NSF (N-ethylmaleimide-sensitive factor) disassembles spent SNARE complexes — this is how the machinery resets. Without NSF, vesicles fuse once and can\'t reset. This is why the toxin mechanism is permanent until new axon terminal sprouting occurs.',
      },
      examCram: {
        oneLineSummary:
          'AP → Ca²⁺ in → synaptotagmin → SNARE zipper → exocytosis. Botox: flaccid (NMJ). Tetanus: spastic (spinal inhibitory).',
        mustKnow: [
          'SNARE: synaptobrevin (vesicle) + syntaxin + SNAP-25 (membrane)',
          'Synaptotagmin = Ca²⁺ sensor',
          'P/Q-type Ca²⁺ channels trigger release at active zone',
          'Botulinum → cleaves SNAP-25/synaptobrevin → blocks NMJ → flaccid paralysis',
          'Tetanus → cleaves synaptobrevin → blocks inhibitory interneurons → spastic',
          'Lambert-Eaton: anti-Ca²⁺ channel antibodies → reduced release (improves with activity)',
        ],
      },
    },
  },
  {
    id: 'card_003',
    unitId: 'unit_02',
    unit: 'Unit 2: Synaptic Transmission',
    topic: 'Glutamate & GABA: Excitation/Inhibition Balance',
    coreIdea:
      'Glutamate is the primary excitatory neurotransmitter; GABA is the primary inhibitory neurotransmitter. Their balance determines cortical excitability. Disruption of this E/I balance underlies epilepsy, anxiety, and excitotoxic injury. NMDA receptors are uniquely voltage- and ligand-gated, making them coincidence detectors for plasticity.',
    keyTerms: [
      { term: 'AMPA receptor', definition: 'Ionotropic glutamate receptor; rapid Na⁺/K⁺ flux; mediates fast excitation' },
      { term: 'NMDA receptor', definition: 'Voltage + ligand gated; requires glycine co-agonist; Mg²⁺ block at rest; Ca²⁺ conductor; LTP trigger' },
      { term: 'GABA-A receptor', definition: 'Ionotropic Cl⁻ channel; fast hyperpolarization; target of benzodiazepines and barbiturates' },
      { term: 'GABA-B receptor', definition: 'Metabotropic; presynaptic inhibition; K⁺ channel activation; baclofen target' },
      { term: 'Excitotoxicity', definition: 'Excessive glutamate → NMDA overactivation → Ca²⁺ overload → apoptosis/necrosis' },
      { term: 'Mg²⁺ block', definition: 'Blocks NMDA channel at resting potential; removed only with sufficient depolarization (voltage gate)' },
    ],
    mechanism:
      '1. Glutamate released from presynaptic terminal\n2. Activates AMPA receptors → Na⁺ influx → depolarization\n3. If depolarization sufficient, Mg²⁺ ejected from NMDA channel\n4. NMDA receptor opens (requires glutamate + glycine + depolarization)\n5. Ca²⁺ enters via NMDA → triggers kinase cascades\n6. GABA released from interneurons → GABA-A opens → Cl⁻ influx → hyperpolarization\n7. GABA-B (presynaptic): reduces Ca²⁺ influx, reduces glutamate release\n8. E/I balance determines whether neuron fires',
    clinicalTieIn:
      'Benzodiazepines enhance GABA-A Cl⁻ conductance (positive allosteric modulator) → anticonvulsant, anxiolytic. Barbiturates increase Cl⁻ channel open duration. Epilepsy = disrupted E/I balance (excess excitation or insufficient inhibition). Stroke → energy failure → glutamate accumulation → excitotoxic Ca²⁺ overload → penumbra expansion. Ketamine: NMDA antagonist → anesthesia/dissociation (glutamate theory of schizophrenia).',
    professorEmphasis:
      'Dr. Chen calls NMDA receptors "the molecular detector of coincidence" — she expects you to explain why both voltage AND ligand gates must open simultaneously. She has a strong interest in excitotoxicity in stroke; expect a clinical vignette with a stroke patient and penumbra expansion. The E/I balance framing appears in almost every lecture.',
    memoryHook:
      'Glutamate = GAS pedal (excite). GABA = BRAKE (inhibit). NMDA = AND gate: needs Glu AND depolarization AND glycine. Benzos = "Boost the Brake" (enhance GABA-A). Excitotoxicity = Too Much Gas with no Brake → engine blows up (Ca²⁺ overload → cell death).',
    likelyExamQuestion:
      'A 68-year-old has an ischemic stroke affecting the left MCA territory. Explain the molecular mechanism by which neurons in the penumbra die in the hours following initial ischemia, even though they are not in the core infarct.',
    likelyExamAnswer:
      'Ischemia causes energy failure → Na⁺/K⁺ ATPase fails → depolarization of damaged neurons → massive glutamate release into the extracellular space. Glutamate activates NMDA receptors on penumbra neurons. With sufficient depolarization, the Mg²⁺ block is relieved → excessive Ca²⁺ influx → activates calpain, phospholipases, mitochondrial dysfunction → apoptotic and necrotic pathways → penumbra death (secondary injury progression over hours).',
    quizLikelihood: 85,
    pinned: false,
    tags: ['neurotransmitters', 'glutamate', 'gaba', 'excitotoxicity', 'clinical', 'receptors'],
    sourceReferences: ['src_transcript_week4', 'src_slides_week4', 'src_study_guide'],
    createdAt: '2026-03-01T00:00:00Z',
    studyModeVariants: {
      professorWording: {
        topic: 'E/I Balance: The Coincidence Detector and Its Clinical Disruptions',
        coreIdea:
          'Dr. Chen\'s framing: "The NMDA receptor is evolution\'s solution to the binding problem — it only opens when the neuron agrees that two things happened at once." This is why it underlies associative learning. Disruption = either too much coincidence (epilepsy, excitotoxicity) or too little (cognitive deficits in NMDA hypofunction models of schizophrenia).',
        mechanism:
          'The critical clinical sequence for stroke: 1) ATP ↓ → 2) Na⁺/K⁺ pump fails → 3) Cells depolarize → 4) Voltage-gated glutamate release → 5) NMDA opens (Mg²⁺ block gone, cells depolarized) → 6) Ca²⁺ storm → 7) Apoptosis. The penumbra is the zone where this cascade is in progress but not irreversible — the therapeutic window.',
      },
      examCram: {
        oneLineSummary:
          'Glu = excite (AMPA fast, NMDA Ca²⁺/plasticity); GABA = inhibit (GABA-A Cl⁻, GABA-B K⁺); E/I imbalance → epilepsy or excitotoxicity.',
        mustKnow: [
          'AMPA: fast Na⁺/K⁺; NMDA: slow Ca²⁺, dual gated (Mg²⁺ block)',
          'NMDA requires: glutamate + glycine + depolarization (AND gate)',
          'GABA-A: ionotropic Cl⁻; benzodiazepines enhance → anticonvulsant',
          'GABA-B: metabotropic; baclofen target; presynaptic inhibition',
          'Excitotoxicity: excess Glu → Ca²⁺ overload → cell death (stroke)',
          'Ketamine: NMDA antagonist; glutamate hypofunction theory of schizophrenia',
        ],
      },
    },
  },
  {
    id: 'card_004',
    unitId: 'unit_03',
    unit: 'Unit 3: Neurotransmitter Systems',
    topic: 'Acetylcholine: NMJ and Autonomic Function',
    coreIdea:
      'Acetylcholine (ACh) mediates neuromuscular junction transmission and autonomic function. NMJ uses nicotinic receptors (ionotropic); autonomic targets use muscarinic receptors (metabotropic). ACh is synthesized from choline + acetyl-CoA by ChAT and degraded by acetylcholinesterase in the synaptic cleft.',
    keyTerms: [
      { term: 'ChAT', definition: 'Choline acetyltransferase — synthesizes ACh from choline + acetyl-CoA' },
      { term: 'AChE', definition: 'Acetylcholinesterase — rapidly degrades ACh in cleft to choline + acetate' },
      { term: 'Nicotinic receptor', definition: 'Ionotropic Na⁺/K⁺ channel; NMJ (N_m) and autonomic ganglia (N_n); fast' },
      { term: 'Muscarinic receptor', definition: 'GPCR; M1-M5 subtypes; heart, smooth muscle, glands; slow' },
      { term: 'MEPP', definition: 'Miniature end-plate potential — spontaneous quantal ACh release from single vesicle' },
      { term: 'End-plate potential', definition: 'Summed response to ACh at NMJ; must reach threshold to trigger muscle AP' },
    ],
    mechanism:
      '1. Motor AP reaches presynaptic terminal\n2. Ca²⁺ influx (P/Q-type channels) triggers ACh exocytosis\n3. ACh diffuses across 50 nm synaptic cleft\n4. Binds nicotinic receptor (α-subunits): opens Na⁺/K⁺ channel\n5. End-plate potential (EPP) generated\n6. EPP depolarizes adjacent membrane → muscle AP → contraction\n7. AChE in cleft rapidly hydrolyzes ACh (half-life <1 ms)\n8. Choline reuptaken by presynaptic terminal for resynthesis',
    clinicalTieIn:
      'Myasthenia gravis: autoantibodies against nicotinic α1 receptors → receptor degradation → fatigue-based weakness (worse with use, improves with rest). Treated with AChE inhibitors (pyridostigmine). Organophosphate poisoning: irreversibly inhibit AChE → ACh accumulation → SLUDGE (Salivation, Lacrimation, Urination, Defecation, GI distress, Emesis) + bronchospasm, miosis. Lambert-Eaton: antibodies against presynaptic Ca²⁺ channels (not AChR).',
    professorEmphasis:
      'Dr. Chen loves the MG vs Lambert-Eaton distinction: presynaptic vs postsynaptic. She expects you to know the SLUDGE mnemonic AND explain it mechanistically. She also focuses on why AChE inhibitors work in MG (increase synaptic ACh to overcome reduced receptor density) but worsen organophosphate toxicity.',
    memoryHook:
      'SLUDGE = Salivation, Lacrimation, Urination, Defecation, GI distress, Emesis (muscarinic excess = parasympathetic storm). MG: postsynaptic (receptor gone) → gets WORSE with use. Lambert-Eaton: presynaptic (Ca²⁺ channels gone) → gets BETTER with use (Ca²⁺ builds up). Opposite fatigue patterns!',
    likelyExamQuestion:
      'A 35-year-old woman presents with bilateral ptosis and diplopia that worsen throughout the day and improve after rest. Edrophonium injection produces rapid improvement. What is the diagnosis, what antibody is involved, and explain the mechanism by which AChE inhibition produces clinical improvement?',
    likelyExamAnswer:
      'Myasthenia gravis. Anti-AChR antibodies (against nicotinic α1 subunit at NMJ) cause receptor internalization and complement-mediated destruction, reducing postsynaptic receptor density. AChE inhibitors (edrophonium short-acting; pyridostigmine long-term) prevent ACh degradation → higher concentration of ACh in the cleft → overcomes reduced receptor density through mass action → improved EPP amplitude → stronger muscle contraction.',
    quizLikelihood: 87,
    pinned: false,
    tags: ['acetylcholine', 'nmj', 'autonomic', 'myasthenia', 'clinical'],
    sourceReferences: ['src_transcript_week5', 'src_quiz_midterm2', 'src_study_guide'],
    createdAt: '2026-03-01T00:00:00Z',
    studyModeVariants: {
      professorWording: {
        topic: 'Cholinergic Transmission: NMJ Pharmacology & Autoimmune Disruption',
        coreIdea:
          'Dr. Chen\'s teaching point: "MG is elegant because you can diagnose it with a syringe and treat it with the same mechanism." The Tensilon (edrophonium) test is both diagnostic AND illustrative of the mechanism. Master the presynaptic vs postsynaptic distinction — it\'s a recurring theme.',
        mechanism:
          'MG weakness pattern matters: ocular muscles first (ptosis, diplopia), bulbar next, respiratory in severe cases. The pattern reflects muscle use demands and NMJ reserve. The therapeutic window of AChE inhibition is narrow — too much → cholinergic crisis (same SLUDGE symptoms as organophosphate). Dr. Chen may ask you to distinguish MG crisis from cholinergic crisis.',
      },
      examCram: {
        oneLineSummary:
          'ACh: ChAT makes it, AChE breaks it. NMJ = nicotinic (ionotropic). Autonomic = muscarinic (GPCR). MG = anti-AChR (postsynaptic, worse with use).',
        mustKnow: [
          'ChAT synthesizes ACh; AChE degrades it rapidly in cleft',
          'Nicotinic (NMJ, ganglia): ionotropic Na⁺/K⁺',
          'Muscarinic (heart, glands, smooth muscle): GPCR, M1-M5',
          'MG: anti-α1-AChR antibodies → fatigue worse with use; treat with AChE inhibitors',
          'Lambert-Eaton: anti-VGCC (presynaptic) → improves with repeated activity',
          'SLUDGE = cholinergic excess (organophosphate poisoning or AChE inhibitor overdose)',
        ],
      },
    },
  },
  {
    id: 'card_005',
    unitId: 'unit_03',
    unit: 'Unit 3: Neurotransmitter Systems',
    topic: 'Dopamine Pathways: The Four Tracts',
    coreIdea:
      'Four major dopaminergic tracts serve distinct functions: nigrostriatal (motor control), mesolimbic (reward/motivation), mesocortical (cognition/executive function), and tuberoinfundibular (prolactin inhibition). Antipsychotics block D2 receptors across all pathways — the therapeutic ratio determines side-effect profile.',
    keyTerms: [
      { term: 'Nigrostriatal', definition: 'Substantia nigra → striatum; motor control, reward learning; damaged in Parkinson\'s' },
      { term: 'Mesolimbic', definition: 'VTA → nucleus accumbens; reward, motivation, addiction; overactive in psychosis (positive symptoms)' },
      { term: 'Mesocortical', definition: 'VTA → prefrontal cortex; executive function, working memory; underactive = negative symptoms' },
      { term: 'Tuberoinfundibular', definition: 'Hypothalamus → pituitary; DA inhibits prolactin; block = hyperprolactinemia' },
      { term: 'D2 receptor', definition: 'Primary target of antipsychotics; Gi-coupled; presynaptic autoreceptor also' },
      { term: 'EPS', definition: 'Extrapyramidal symptoms: drug-induced parkinsonism, akathisia, dystonia — from D2 blockade in nigrostriatal' },
    ],
    mechanism:
      '1. DA synthesized: tyrosine → DOPA (tyrosine hydroxylase, rate-limiting) → DA (DOPA decarboxylase)\n2. DA stored in vesicles via VMAT2\n3. Released by Ca²⁺-dependent exocytosis\n4. Acts on D1 (Gs, ↑cAMP) or D2 (Gi, ↓cAMP) receptors\n5. Terminated by: reuptake via DAT, degradation by MAO-B and COMT\n6. In Parkinson\'s: SNc neurons die → striatum loses DA input → indirect pathway overactive → excess thalamic inhibition → bradykinesia',
    clinicalTieIn:
      'Parkinson\'s disease: SNc degeneration → dopamine loss in nigrostriatal tract → TRAP (Tremor, Rigidity, Akinesia/bradykinesia, Postural instability). Treatment: L-DOPA + carbidopa (periphery decarboxylase inhibitor). Schizophrenia: mesolimbic overactivity (positive symptoms); mesocortical underactivity (negative symptoms). Antipsychotics (D2 blockers) risk EPS (nigrostriatal) and hyperprolactinemia (tuberoinfundibular).',
    professorEmphasis:
      'Dr. Chen has asked about the four tracts on every exam since 2022. She always asks "why does blocking D2 receptors cause both therapeutic effects AND side effects?" — the answer lies in the four-tract model. She also focuses on why typical antipsychotics cause more EPS than atypicals (D2 specificity vs 5-HT2A co-blockade).',
    memoryHook:
      'MTML: Mesolimbic (Motivation/reward), Mesocortical (Memory/cognition), Tuberoinfundibular (prolacTin), Nigrostriatal (moNigostriatal = motor control). Antipsychotic D2 blockade: GOOD in mesolimbic (stops psychosis), BAD in nigrostriatal (EPS), BAD in tuberoinfundibular (prolactin ↑), BAD in mesocortical (worsens negative symptoms).',
    likelyExamQuestion:
      'A patient with schizophrenia starts haloperidol (typical antipsychotic). List two therapeutic effects and two adverse effects you would expect, explaining each in terms of the dopamine pathway affected.',
    likelyExamAnswer:
      'Therapeutic: 1) Reduced positive symptoms (hallucinations, delusions) — D2 blockade in mesolimbic pathway ↓ dopamine overactivity. 2) [Limited benefit for negative symptoms]. Adverse: 1) Extrapyramidal symptoms (drug-induced parkinsonism, akathisia, dystonia) — D2 blockade in nigrostriatal pathway mimics DA deficiency → movement dysregulation. 2) Hyperprolactinemia (galactorrhea, amenorrhea) — D2 blockade in tuberoinfundibular pathway removes DA inhibition of prolactin release from anterior pituitary.',
    quizLikelihood: 91,
    pinned: false,
    tags: ['dopamine', 'antipsychotics', 'parkinsons', 'schizophrenia', 'pathways', 'clinical'],
    sourceReferences: ['src_transcript_week5', 'src_slides_week5', 'src_quiz_midterm2'],
    createdAt: '2026-03-01T00:00:00Z',
    studyModeVariants: {
      professorWording: {
        topic: 'The Four-Tract Model: Why Every Antipsychotic Is a Compromise',
        coreIdea:
          'Dr. Chen\'s teaching: "There is no such thing as a targeted antipsychotic — blocking D2 in one tract means blocking it in all four. Atypicals reduce EPS by co-blocking 5-HT2A, which reverses D2 blockade in the nigrostriatal tract specifically. This is the entire rationale for second-generation antipsychotics."',
        mechanism:
          'The key pathway to know for Parkinson\'s: SNc → (DA) → striatum → regulates direct (Go/movement) and indirect (Stop/movement) pathways. DA normally facilitates direct and inhibits indirect. Loss of DA = overactive indirect pathway = too much inhibition of motor output = bradykinesia/rigidity. L-DOPA restores this balance.',
      },
      examCram: {
        oneLineSummary:
          'Nigrostriatal (motor), Mesolimbic (reward/psychosis), Mesocortical (cognition), Tuberoinfundibular (prolactin). D2 block = antipsychotic + EPS + prolactin ↑.',
        mustKnow: [
          'Parkinson\'s = nigrostriatal degeneration → TRAP; treat with L-DOPA/carbidopa',
          'Schizophrenia: mesolimbic ↑ (positive sx) + mesocortical ↓ (negative sx)',
          'Antipsychotics: D2 block → therapeutic in mesolimbic, EPS in nigrostriatal',
          'Typical antipsychotics (haloperidol): high EPS risk',
          'Atypicals: 5-HT2A + D2 block → less EPS (reversal in nigrostriatal)',
          'Tuberoinfundibular blockade → hyperprolactinemia (galactorrhea, amenorrhea)',
        ],
      },
    },
  },
  {
    id: 'card_006',
    unitId: 'unit_04',
    unit: 'Unit 4: Sensory & Motor Systems',
    topic: 'Somatosensory Pathways: DC-ML vs Anterolateral',
    coreIdea:
      'Two major ascending somatosensory pathways carry different modalities. The Dorsal Column-Medial Lemniscal (DC-ML) pathway carries fine touch, proprioception, and vibration; it crosses at the medulla. The Anterolateral System (spinothalamic tract) carries pain, temperature, and crude touch; it crosses at the spinal cord (within 2 levels). This difference determines lesion localization.',
    keyTerms: [
      { term: 'DC-ML pathway', definition: 'Dorsal column → gracile/cuneate nuclei (medulla) → crosses → medial lemniscus → VPL thalamus → S1' },
      { term: 'Spinothalamic tract', definition: 'Enters cord → crosses within 1-2 levels → anterolateral column → VPL thalamus → S1' },
      { term: 'VPL nucleus', definition: 'Ventral posterolateral thalamus — receives all body somatosensory input; relays to S1' },
      { term: 'VPM nucleus', definition: 'Ventral posteromedial thalamus — receives facial sensory (via trigeminal); relays to S1' },
      { term: 'Brown-Séquard syndrome', definition: 'Hemisection of spinal cord: ipsilateral DC-ML loss + contralateral pain/temp loss below lesion' },
      { term: 'Somatotopy', definition: 'Topographic organization of sensory body map maintained from receptor to cortex' },
    ],
    mechanism:
      'DC-ML: 1st neuron (DRG) → ipsilateral dorsal column → nucleus gracilis/cuneatus (medulla) → 2nd neuron crosses midline (decussates) → medial lemniscus → VPL thalamus → 3rd neuron → primary somatosensory cortex (S1, parietal lobe)\n\nAnterolateral: 1st neuron (DRG) → dorsal horn → 2nd neuron crosses within 1-2 spinal levels → contralateral anterolateral column → spinothalamic tract → VPL → 3rd neuron → S1',
    clinicalTieIn:
      'Brown-Séquard syndrome (spinal cord hemisection): ipsilateral loss of fine touch, proprioception, vibration (DC-ML); contralateral loss of pain and temperature below lesion (spinothalamic crossed at cord). Syringomyelia: central cord expansion destroys crossing spinothalamic fibers → bilateral loss of pain/temp at lesion level ("cape distribution") with preserved touch. Tabes dorsalis (syphilis): destroys dorsal columns → loss of proprioception → ataxia + Romberg positive.',
    professorEmphasis:
      'Dr. Chen says: "If you can draw the decussation levels for both pathways, you can answer any spinal cord lesion question on the boards." She has given Brown-Séquard as a case vignette in two of the last three exams. She also tests the "why Romberg positive" reasoning (proprioception loss, not cerebellar).',
    memoryHook:
      'DC-ML = Discriminative → crosses at Medulla (MM). ALS (Anterolateral System) = pain/temp → crosses Almost immediately at Leveled cord (AAL). Brown-Séquard: SAME side loses fine touch (DC-ML stays ipsilateral longer), OPPOSITE side loses pain (ALS already crossed). "SAME fine touch, OPPOSITE pain."',
    likelyExamQuestion:
      'A patient suffers a right-sided knife wound at T6 resulting in spinal cord hemisection. Describe the expected sensory deficits below the lesion, explaining the neuroanatomical basis for each.',
    likelyExamAnswer:
      'Right side below T6: loss of fine touch, vibration, and proprioception (DC-ML runs ipsilaterally until medulla decussation → right DC-ML interrupted → right-sided loss). Left side below T6: loss of pain and temperature sensation (spinothalamic fibers cross within 1-2 levels of entry → left-sided pain/temp fibers already crossed to right side at or below T4/T5, then ascend ipsilaterally in right anterolateral column → interrupted). Motor: right-sided UMN signs below T6 (right CST also interrupted).',
    quizLikelihood: 83,
    pinned: false,
    tags: ['somatosensory', 'pathways', 'spinal-cord', 'clinical', 'brown-sequard'],
    sourceReferences: ['src_transcript_week7', 'src_slides_week7', 'src_study_guide'],
    createdAt: '2026-03-01T00:00:00Z',
    studyModeVariants: {
      professorWording: {
        topic: 'The Two-Pathway Model: Decussation Levels as the Diagnostic Key',
        coreIdea:
          'Dr. Chen\'s teaching: "The entire clinical utility of neuroanatomy reduces to one question: where does this pathway cross? DC-ML crosses in the medulla. Spinothalamic crosses in the cord. Everything else follows from that." Learn the decussation levels and you\'ve learned spinal cord localization.',
        mechanism:
          'For clinical application, think in terms of: ipsilateral = same side as lesion. The DC-ML is still ipsilateral in the cord, so ipsilateral cord lesion → ipsilateral fine touch loss. The spinothalamic already crossed, so ipsilateral cord lesion → CONTRALATERAL pain/temp loss. This counterintuitive finding is the hallmark of Brown-Séquard.',
      },
      examCram: {
        oneLineSummary:
          'DC-ML: fine touch/proprioception/vibration, crosses at medulla. Spinothalamic: pain/temp, crosses at cord (1-2 levels). Brown-Séquard: ipsi DC-ML loss, contra pain/temp loss.',
        mustKnow: [
          'DC-ML: ipsilateral in cord → crosses at medulla → contralateral in brain',
          'Spinothalamic: crosses in cord (1-2 levels after entry) → contralateral in cord',
          'Brown-Séquard: ipsilateral fine touch loss + contralateral pain/temp loss',
          'Both converge at VPL thalamus → S1 cortex',
          'VPM = face (trigeminal); VPL = body',
          'Syringomyelia: bilateral pain/temp loss (cape), spares touch',
          'Tabes dorsalis: dorsal column loss → proprioceptive ataxia, Romberg+',
        ],
      },
    },
  },
  {
    id: 'card_007',
    unitId: 'unit_04',
    unit: 'Unit 4: Sensory & Motor Systems',
    topic: 'Motor Cortex & Corticospinal Tract: UMN vs LMN',
    coreIdea:
      'The corticospinal tract (CST) is the primary voluntary motor pathway, originating in M1 (precentral gyrus) and crossing at the medullary pyramids. Upper motor neurons (UMN) extend from cortex to spinal cord; lower motor neurons (LMN) extend from cord to muscle. Lesions at each level produce distinct, clinically opposite signs — critical for neurological localization.',
    keyTerms: [
      { term: 'Upper Motor Neuron (UMN)', definition: 'Cortex → spinal cord; lesion causes spasticity, hyperreflexia, Babinski, weakness' },
      { term: 'Lower Motor Neuron (LMN)', definition: 'Anterior horn → muscle; lesion causes flaccidity, hyporeflexia, atrophy, fasciculations' },
      { term: 'Medullary decussation', definition: 'CST crosses at medullary pyramids → contralateral control of body' },
      { term: 'Babinski sign', definition: 'Dorsiflexion of great toe + fanning on plantar stimulation; UMN sign (normal in infants)' },
      { term: 'Internal capsule', definition: 'Dense white matter bundle; posterior limb carries CST; stroke here = contralateral hemiplegia' },
      { term: 'Spastic paraplegia', definition: 'Bilateral UMN lesion (cord or bilateral cortical); bilateral weakness + spasticity' },
    ],
    mechanism:
      'UMN (Corticospinal Tract):\n1. Motor cortex (M1, precentral gyrus) → corona radiata → internal capsule (posterior limb)\n2. Cerebral peduncles (midbrain) → basis pontis → medullary pyramids\n3. Decussation at caudal medulla (85-90%)\n4. Lateral CST: contralateral limb control\n5. Anterior CST: ipsilateral axial muscle control (crosses at cord level)\n\nLMN: Anterior horn cell (α-motor neuron) → ventral root → peripheral nerve → NMJ → muscle',
    clinicalTieIn:
      'Stroke (internal capsule): contralateral UMN hemiplegia (spastic, hyperreflexic, Babinski+). ALS: UMN + LMN combination (spasticity + atrophy + fasciculations = pathognomonic). Pure LMN: polio (anterior horn), Guillain-Barré (peripheral), herniated disc (radiculopathy). UMN above decussation = contralateral deficit. UMN in spinal cord = ipsilateral deficit. Face: corticobulbar tract, UMN spares forehead (bilateral cortical representation).',
    professorEmphasis:
      'Dr. Chen always tests UMN vs LMN on the final. She explicitly said: "Know this, it is the most tested pattern in clinical neurology." She focuses on ALS as the "both UMN and LMN" example. She also always tests the forehead sparing rule (central facial palsy vs Bell\'s palsy distinction).',
    memoryHook:
      'UMN: "Stiff, Strong reflexes, Stuck Babinski" (spastic, hyperreflexic, upgoing toe). LMN: "Floppy, Flat reflexes, Fasciulations, atrophy" (flaccid, hyporeflexia, wasting). ALS = BOTH. Face: UMN spares forehead (bilateral representation) → only LOWER face affected. Bell\'s palsy = LMN (CN7) → ALL face affected including forehead.',
    likelyExamQuestion:
      'A 62-year-old man has right arm weakness, right facial droop (sparing the forehead), brisk right-sided reflexes, and right Babinski sign. Where is the lesion and what is the most likely etiology?',
    likelyExamAnswer:
      'Left internal capsule or left corticobulbar/corticospinal tract above the medullary decussation. The right-sided contralateral deficits and UMN signs (hyperreflexia, Babinski) localize to the left hemisphere above the pyramidal decussation. Forehead sparing indicates a UMN (central) facial palsy — the forehead receives bilateral cortical representation, so unilateral lesion spares it. Most likely etiology: left MCA territory ischemic stroke (internal capsule lies in MCA territory).',
    quizLikelihood: 89,
    pinned: false,
    tags: ['motor', 'umn', 'lmn', 'corticospinal', 'stroke', 'clinical', 'localization'],
    sourceReferences: ['src_transcript_week8', 'src_quiz_midterm2', 'src_slides_week8'],
    createdAt: '2026-03-01T00:00:00Z',
    studyModeVariants: {
      professorWording: {
        topic: 'UMN vs LMN: The Foundational Localization Framework',
        coreIdea:
          'Dr. Chen\'s teaching: "If you can distinguish UMN from LMN, you can localize almost any motor lesion. The signs are opposite because UMN normally suppresses the stretch reflex and maintains tone. Remove UMN = disinhibition = spasticity and hyperreflexia. Destroy LMN = nothing reaches muscle = flaccidity."',
        mechanism:
          'The forehead sparing rule is Dr. Chen\'s favorite clincher: cortical representation of the face is bilateral — both hemispheres contribute UMN fibers to the facial motor nucleus. Forehead (superior) gets bilateral input more than the lower face. Therefore: UMN lesion → lower face only (other hemisphere still drives forehead). LMN (Bell\'s) → CN7 nucleus/nerve damaged → all ipsilateral face paralyzed including forehead.',
      },
      examCram: {
        oneLineSummary:
          'UMN: spastic, hyperreflexic, Babinski+, no atrophy. LMN: flaccid, hyporeflexic, atrophy, fasciculations. ALS = both. CST crosses at medullary pyramids.',
        mustKnow: [
          'UMN signs: spasticity, hyperreflexia, Babinski, clonus, weakness (no atrophy early)',
          'LMN signs: flaccidity, hyporeflexia, atrophy, fasciculations',
          'CST decussates at caudal medulla → contralateral control',
          'ALS = UMN + LMN simultaneously',
          'UMN facial palsy: spares forehead (bilateral cortical input)',
          'LMN facial palsy (Bell\'s): involves forehead + all ipsilateral face',
          'Internal capsule stroke: dense contralateral hemiplegia (UMN)',
        ],
      },
    },
  },
  {
    id: 'card_008',
    unitId: 'unit_05',
    unit: 'Unit 5: Plasticity & Higher Function',
    topic: 'Neuroplasticity & LTP Mechanism',
    coreIdea:
      'Long-term potentiation (LTP) is the primary cellular mechanism of learning and memory, requiring coincident pre- and postsynaptic activity. The NMDA receptor acts as a molecular coincidence detector. Ca²⁺ influx through NMDA triggers kinase cascades (especially CaMKII) that insert AMPA receptors and strengthen synaptic connections — embodying Hebb\'s postulate.',
    keyTerms: [
      { term: 'LTP', definition: 'Long-term potentiation — persistent synaptic strengthening induced by high-frequency stimulation' },
      { term: 'CaMKII', definition: 'Ca²⁺/calmodulin-dependent kinase II — autophosphorylates → constitutively active → critical LTP effector' },
      { term: 'AMPA insertion', definition: 'AMPA receptors trafficked to synapse during LTP → increased postsynaptic sensitivity' },
      { term: 'Hebbian plasticity', definition: '"Neurons that fire together wire together" — activity-dependent synaptic strengthening' },
      { term: 'BDNF', definition: 'Brain-derived neurotrophic factor — released during activity; promotes synaptic consolidation; antidepressant target' },
      { term: 'LTD', definition: 'Long-term depression — weakens synapses; requires low-frequency stimulation, modest Ca²⁺ rise, phosphatase activation' },
    ],
    mechanism:
      '1. High-frequency presynaptic firing releases glutamate\n2. AMPA activation depolarizes postsynaptic membrane\n3. Depolarization ejects Mg²⁺ from NMDA channel\n4. NMDA now opens (glutamate already bound): Ca²⁺ influx\n5. Ca²⁺ activates calmodulin → activates CaMKII\n6. CaMKII: phosphorylates existing AMPA receptors (↑conductance) + triggers AMPA insertion from endosomes\n7. Also: CREB phosphorylation → gene expression → structural changes (spine growth)\n8. Late LTP: requires protein synthesis → dendritic spine enlargement, new AMPA receptor transcription',
    clinicalTieIn:
      'Alzheimer\'s disease: amyloid-β oligomers impair LTP (block NMDA function) and promote LTD-like synaptic depression → cognitive decline. Memantine (NMDA antagonist) reduces excitotoxic component of AD by blocking pathological NMDA activation without blocking normal LTP stimuli (partial block). Depression: reduced BDNF levels → impaired synaptic plasticity; antidepressants (SSRIs, ketamine) restore BDNF. Stroke rehab: motor plasticity requires LTP-like mechanisms in perilesional cortex.',
    professorEmphasis:
      'Dr. Chen calls LTP "the molecular embodiment of Hebb\'s rule" and expects you to trace the Ca²⁺ → CaMKII → AMPA insertion pathway in order. She often asks why NMDA is the "coincidence detector" — both voltage AND ligand gates must open simultaneously. She has linked LTP to Alzheimer\'s pathology in recent lectures, suggesting this will appear on the final.',
    memoryHook:
      'LTP = "Learning Through Potentiation." Ca²⁺ → CaM → CaMKII → CAMKII kamikaze autophosphorylates itself to stay active (like locking the learning switch on). AMPA receptors are the RESULT of LTP — more AMPA = more sensitive synapse = stronger memory. Hebb\'s rule: "Fire together, wire together; fail to fire, lose the wire" (LTD).',
    likelyExamQuestion:
      'Explain the molecular mechanism by which a high-frequency burst of synaptic activity leads to long-lasting potentiation of that synapse. Why is the NMDA receptor specifically suited to this role?',
    likelyExamAnswer:
      'High-frequency stimulation causes repetitive AMPA activation → sustained postsynaptic depolarization → Mg²⁺ block relieved from NMDA channels. With glutamate already bound (from presynaptic activity) and glycine as co-agonist, NMDA opens → Ca²⁺ influx. Ca²⁺ binds calmodulin → activates CaMKII. CaMKII autophosphorylates → remains constitutively active → phosphorylates AMPA receptors (↑conductance) and recruits additional AMPA receptors from intracellular pools to the synapse. More AMPA receptors = larger postsynaptic response to same presynaptic input = potentiation. NMDA is ideal because it requires both presynaptic activity (glutamate binding) AND postsynaptic depolarization (voltage gate) simultaneously — a molecular implementation of Hebb\'s coincidence requirement.',
    quizLikelihood: 79,
    pinned: false,
    tags: ['ltp', 'plasticity', 'memory', 'nmda', 'camkii', 'alzheimers'],
    sourceReferences: ['src_transcript_week10', 'src_slides_week10', 'src_textbook'],
    createdAt: '2026-03-01T00:00:00Z',
    studyModeVariants: {
      professorWording: {
        topic: 'LTP as Molecular Hebbian Learning: NMDA as Coincidence Detector',
        coreIdea:
          'Dr. Chen\'s framing: "Hebb said neurons that fire together wire together in 1949. Bliss and Lømo proved it in hippocampal slices in 1973. CaMKII explained HOW in the 1990s. Know this timeline — it shows how neuroscience built on itself." The NMDA receptor\'s dual gate (ligand + voltage) is the biochemical implementation of Hebb\'s coincidence requirement.',
        mechanism:
          'Dr. Chen will likely ask about the difference between early LTP (minutes to hours, kinase-dependent, no new protein synthesis) and late LTP (hours to days, requires new protein synthesis via CREB, structural spine changes). This distinction maps to short-term vs long-term memory consolidation. Alzheimer\'s connection: Aβ oligomers preferentially impair late LTP → explains why AD affects new memory formation more than remote memories.',
      },
      examCram: {
        oneLineSummary:
          'LTP: NMDA Ca²⁺ → CaMKII → AMPA insertion → synaptic strengthening. NMDA = coincidence detector (needs voltage + ligand). Basis of learning/memory.',
        mustKnow: [
          'LTP requires: high-frequency stimulation, NMDA activation, Ca²⁺ influx',
          'Ca²⁺ → calmodulin → CaMKII → AMPA receptor phosphorylation + insertion',
          'NMDA = coincidence detector: needs glutamate + depolarization (Mg²⁺ ejection)',
          'BDNF: activity-dependent; promotes synaptic consolidation; ↓ in depression',
          'Alzheimer\'s: Aβ impairs NMDA/LTP → cognitive decline',
          'Memantine: partial NMDA antagonist → reduces excitotoxicity in AD',
          'LTD: low-frequency stim → modest Ca²⁺ → phosphatases → AMPA removal',
        ],
      },
    },
  },
];
