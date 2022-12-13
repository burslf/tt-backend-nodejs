import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";

const invoke_lambda = async (function_name: string) => {
    const env = process.env['ENV'];
    
    const lambda = new LambdaClient({});
    console.log("Invoking: ", function_name)
  
    const command = new InvokeCommand({
      FunctionName: `billeterie-backend-${env}-${function_name}`,
      InvocationType: 'RequestResponse',
    })
    return await lambda.send(command);
} 

export {
    invoke_lambda
}