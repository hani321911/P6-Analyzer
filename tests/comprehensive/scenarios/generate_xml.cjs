// XML generator for Smart Cost Detection testing
// Generates P6 XML with various cost storage methods

const ns = `http://xmlns.oracle.com/Primavera/P6Professional/V17.7/API/BusinessObjects`;

function buildXML({ project = {}, activities = [], expenses = [], wbs = [], calendars = [] }) {
  const projXml = `
  <Project>
    <Id>${project.id || 'TEST'}</Id>
    <Name>${project.name || 'Test Project'}</Name>
    <ObjectId>${project.objId || '999'}</ObjectId>
    <DataDate>${project.dataDate || '2026-01-15T00:00:00'}</DataDate>
    <PlannedStartDate>${project.start || '2026-01-01T00:00:00'}</PlannedStartDate>
    <FinishDate>${project.finish || '2026-12-31T00:00:00'}</FinishDate>
    <ActivityDefaultPercentCompleteType>${project.defaultPctType || 'Duration'}</ActivityDefaultPercentCompleteType>
  </Project>`;
  
  const actsXml = activities.map(a => `
  <Activity>
    <Id>${a.actId}</Id>
    <ObjectId>${a.objId}</ObjectId>
    <Name>${a.name || a.actId}</Name>
    <Type>${a.type || 'Task Dependent'}</Type>
    <Status>${a.status || 'Not Started'}</Status>
    <ProjectObjectId>${project.objId || '999'}</ProjectObjectId>
    <PercentCompleteType>${a.pctType || 'Duration'}</PercentCompleteType>
    <PercentComplete>${a.pctComplete ?? 0}</PercentComplete>
    <DurationPercentComplete>${a.durationPct ?? 0}</DurationPercentComplete>
    <PhysicalPercentComplete>${a.physicalPct ?? 0}</PhysicalPercentComplete>
    <UnitsPercentComplete>${a.unitsPct ?? 0}</UnitsPercentComplete>
    <PlannedStartDate>${a.plannedStart || '2026-01-01T00:00:00'}</PlannedStartDate>
    <PlannedFinishDate>${a.plannedFinish || '2026-01-10T00:00:00'}</PlannedFinishDate>
    ${a.actualStart ? `<ActualStartDate>${a.actualStart}</ActualStartDate>` : '<ActualStartDate xsi:nil="true" />'}
    ${a.actualFinish ? `<ActualFinishDate>${a.actualFinish}</ActualFinishDate>` : '<ActualFinishDate xsi:nil="true" />'}
    <PlannedDuration>${a.plannedDuration ?? 80}</PlannedDuration>
    <ActualDuration>${a.actualDuration ?? 0}</ActualDuration>
    <RemainingDuration>${a.remainingDuration ?? 80}</RemainingDuration>
    <AtCompletionDuration>${a.atCompletionDuration ?? 80}</AtCompletionDuration>
    <PlannedNonLaborCost>${a.plannedNonLaborCost ?? 0}</PlannedNonLaborCost>
    <PlannedLaborCost>${a.plannedLaborCost ?? 0}</PlannedLaborCost>
    <PlannedMaterialCost>${a.plannedMaterialCost ?? 0}</PlannedMaterialCost>
    <PlannedExpenseCost>${a.plannedExpenseCost ?? 0}</PlannedExpenseCost>
    <ActualNonLaborCost>${a.actualNonLaborCost ?? 0}</ActualNonLaborCost>
    <ActualLaborCost>${a.actualLaborCost ?? 0}</ActualLaborCost>
    <ActualMaterialCost>${a.actualMaterialCost ?? 0}</ActualMaterialCost>
    <ActualExpenseCost>${a.actualExpenseCost ?? 0}</ActualExpenseCost>
    <PlannedNonLaborUnits>${a.plannedNonLaborUnits ?? 0}</PlannedNonLaborUnits>
    <PlannedLaborUnits>${a.plannedLaborUnits ?? 0}</PlannedLaborUnits>
    <PlannedMaterialUnits>${a.plannedMaterialUnits ?? 0}</PlannedMaterialUnits>
    <AtCompletionExpenseCost>${a.atCompletionExpenseCost ?? 0}</AtCompletionExpenseCost>
    <AtCompletionLaborCost>${a.atCompletionLaborCost ?? 0}</AtCompletionLaborCost>
    <AtCompletionNonLaborCost>${a.atCompletionNonLaborCost ?? 0}</AtCompletionNonLaborCost>
    ${a.wbs ? `<WBSObjectId>${a.wbs}</WBSObjectId>` : ''}
  </Activity>`).join('');
  
  const expXml = expenses.map(e => `
  <ActivityExpense>
    <ActivityObjectId>${e.actObjId}</ActivityObjectId>
    <ObjectId>${e.objId}</ObjectId>
    <ExpenseItem>${e.item || 'Weightages'}</ExpenseItem>
    <PlannedCost>${e.plannedCost ?? 0}</PlannedCost>
    <ActualCost>${e.actualCost ?? 0}</ActualCost>
    <RemainingCost>${e.remainingCost ?? e.plannedCost ?? 0}</RemainingCost>
    <PlannedUnits>${e.plannedUnits ?? 1}</PlannedUnits>
    <RemainingUnits>${e.remainingUnits ?? 1}</RemainingUnits>
    <PricePerUnit>${e.pricePerUnit ?? e.plannedCost ?? 0}</PricePerUnit>
    <ProjectObjectId>${project.objId || '999'}</ProjectObjectId>
  </ActivityExpense>`).join('');
  
  return `<?xml version="1.0" encoding="utf-8"?>
<APIBusinessObjects xmlns="${ns}" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  ${projXml}
  ${actsXml}
  ${expXml}
</APIBusinessObjects>`;
}

module.exports = { buildXML };
