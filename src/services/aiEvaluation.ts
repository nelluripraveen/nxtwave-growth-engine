import type { ProjectSubmission, ProjectEvaluation } from '../store/dataStore';

/**
 * AI Evaluation Service
 * 
 * In a real-world scenario with an API key, this would call an endpoint 
 * that hits Vercel AI SDK, OpenAI, Anthropic, or similar.
 * 
 * We simulate a backend response to demonstrate the evaluation flow securely.
 * This function deterministically parses the submission text to provide realistic 
 * contextual feedback, simulating an LLM response.
 */
export async function evaluateProject(project: ProjectSubmission): Promise<ProjectEvaluation> {
  // Simulate network latency & LLM generation time (4-6 seconds)
  const delay = Math.floor(Math.random() * 2000) + 4000;
  await new Promise(resolve => setTimeout(resolve, delay));

  const desc = project.description.toLowerCase();
  const hasGithub = project.githubUrl.includes('github.com');
  const hasDemo = project.demoUrl && project.demoUrl.length > 5;
  
  // Base scores
  let probDef = 12; // Out of 20
  let aiImpl = 10;  // Out of 20
  let techImpl = 10; // Out of 20
  let innov = 8;    // Out of 15
  let doc = 4;      // Out of 10
  let demo = hasDemo ? 7 : 0; // Out of 10
  let comp = 2;     // Out of 5

  const strengths: string[] = [];
  const improvements: string[] = [];
  const nextSteps: string[] = [];

  // Problem Definition Logic
  if (desc.length > 100) { probDef += 4; }
  if (desc.includes('problem') || desc.includes('solve')) { probDef += 4; strengths.push('Clear problem statement identified.'); }
  else { improvements.push('Explicitly define the core problem your project is solving.'); nextSteps.push('Add a "Problem Statement" section to your description.'); }

  // AI Implementation Logic
  if (desc.includes('model') || desc.includes('predict') || desc.includes('classify')) { 
    aiImpl += 5; 
    strengths.push('Relevant AI/ML use case implemented.');
  }
  if (desc.includes('tensorflow') || desc.includes('pytorch') || desc.includes('scikit') || desc.includes('openai')) {
    aiImpl += 5;
    strengths.push('Good usage of standard AI frameworks/libraries.');
  } else {
    improvements.push('Explain which specific AI models or libraries were used.');
    nextSteps.push('Document your model selection process.');
  }

  // Technical Implementation Logic
  if (hasGithub) {
    techImpl += 6;
    strengths.push('Source code versioned and accessible on GitHub.');
    if (desc.includes('api') || desc.includes('backend') || desc.includes('database')) {
      techImpl += 4;
      strengths.push('Solid architectural structure mentioned.');
    }
  } else {
    improvements.push('Ensure your GitHub repository is public and accessible.');
  }

  // Innovation Logic
  if (desc.length > 200 && aiImpl > 15) {
    innov += 5;
    strengths.push('Creative application of AI to the specified domain.');
  }

  // Documentation Logic
  if (desc.length > 150) {
    doc += 4;
  }
  if (desc.includes('how to run') || desc.includes('setup') || desc.includes('install')) {
    doc += 2;
    strengths.push('Provided instructions for running the project.');
  } else {
    improvements.push('Improve technical documentation (e.g., add setup instructions).');
    nextSteps.push('Add a detailed README with installation steps.');
  }

  // Demo Logic
  if (hasDemo) {
    demo += 2;
    strengths.push('Live demo provided for easy testing.');
  } else {
    improvements.push('Add a live demo or screenshots of the working application.');
    nextSteps.push('Deploy your project and provide a live URL.');
  }

  // Completeness
  if (probDef > 15 && aiImpl > 15 && hasGithub && hasDemo) {
    comp = 5;
  } else if (hasGithub && desc.length > 50) {
    comp = 4;
  }

  // Cap scores
  probDef = Math.min(20, probDef);
  aiImpl = Math.min(20, aiImpl);
  techImpl = Math.min(20, techImpl);
  innov = Math.min(15, innov);
  doc = Math.min(10, doc);
  demo = Math.min(10, demo);
  comp = Math.min(5, comp);

  const overallScore = probDef + aiImpl + techImpl + innov + doc + demo + comp;

  let recommendation = '';
  if (overallScore > 85) {
    recommendation = "Excellent work! Your project demonstrates strong technical skills and clear documentation. It's ready to be showcased in your portfolio and placement interviews.";
  } else if (overallScore > 65) {
    recommendation = "Your project has a strong practical foundation. Before presenting it in an interview, focus on improving documentation and clarifying your AI architecture.";
  } else {
    recommendation = "You have a good starting point, but the project needs more detail. Ensure your repository is accessible, explain your AI model clearly, and add setup instructions.";
  }

  // Fallbacks if empty
  if (strengths.length === 0) strengths.push('Good effort in submitting the project.');
  if (improvements.length === 0) improvements.push('Add more details to your project description.');
  if (nextSteps.length === 0) nextSteps.push('Review standard AI project structures.');

  return {
    overallScore,
    criteria: {
      problemDefinition: probDef,
      aiImplementation: aiImpl,
      technicalImplementation: techImpl,
      innovation: innov,
      documentation: doc,
      demo,
      completeness: comp,
    },
    strengths,
    improvements,
    nextSteps,
    verification: {
      github: hasGithub ? 'verified' : 'not_verified',
      demo: hasDemo ? 'verified' : 'not_verified',
    },
    recommendation,
  };
}
