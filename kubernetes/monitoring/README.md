# APP DEPLOYMENT

azd init

Adapt ./.azure/devops-agent/.env
If necessary, adapt ./infra/main.bicep


# AZURE/KUBERNETES

Resourcen:
ManagedID app-midevopsagent
ManagedID loki-midevopsagent
ServiceAccount todo-api-sa
ServiceAccount loki-sa

StorageAccount devopsagentloki
 
//For usage of ManagedIDs
az aks update --name aks-devops-agent --enable-oidc-issuer --enable-workload-identity  
az aks show --name aks-devops-agent --resource-group rg-devops-agent --query "oidcIssuerProfile.issuerUrl" -o tsv
az identity federated-credential create --name app-fedcreddevopsagent --identity-name 373e0a21-1d7a-4ee4-9bc6-8dee655b4f44 --resource-group rg-devops-agent --issuer https://westeurope.oic.prod-aks.azure.com/76a2ae5a-9f00-4f6b-95ed-5d33d77c4d61/672e32d1-16f0-4569-9625-dcf805a3113b/ --subject system:serviceaccount:todo-nodejs-mongo-aks:todo-api-sa --audience api://AzureADTokenExchange
az identity show -g rg-devops-agent --name app-fedcreddevopsagent

//Generate AccessTokens from AKS
//Apply Rules to ManagedIDs
//Grant ManagedIDs access to StorageAccounts

kubectl create namespace monitoring
 
kubectl create serviceaccount -f loki-sa.yml
kubectl create serviceaccount -f todo-api-sa.yml

helm repo add grafana https://grafana.github.io/helm-charts
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

helm repo update

cd ./Loki
helm upgrade --install loki grafana/loki -n monitoring -f loki-values.yaml
helm upgrade --install grafana -n monitoring

cd ./Promtail
helm template promtail grafana/promtail -n monitoring -f values.yml > promtail-manifests.yml
kubectl apply -f promtail-manifests.yml

helm upgrade --install 

