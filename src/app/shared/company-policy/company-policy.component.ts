import { Component } from '@angular/core';

@Component({
  selector: 'app-company-policy',
  templateUrl: './company-policy.component.html',
  styleUrl: './company-policy.component.scss'
})
export class CompanyPolicyComponent {

  docum = [
    { name: 'WFH', description: 'Description of Policy 1', link: 'https://example.com/policy1', size: '2MB', date: '2023-01-01' },
    { name: 'joininng formalities', description: 'Description of Policy 2', link: 'https://example.com/policy2', size: '1.5MB', date: '2023-02-01' },
    { name: 'POSH', description: 'Description of Policy 3', link: 'https://example.com/policy3', size: '1MB', date: '2023-03-01' },
    { name: 'Leaves', description: 'Description of Policy 4', link: 'https://example.com/policy4', size: '2.5MB', date: '2023-04-01' },
    { name: 'Exit document', description: 'Description of Policy 5', link: 'https://example.com/policy5', size: '3MB', date: '2023-05-01' },
    { name: 'Policy 5', description: 'Description of Policy 5', link: 'https://example.com/policy5', size: '3MB', date: '2023-05-01' },
    { name: 'Policy 5', description: 'Description of Policy 5', link: 'https://example.com/policy5', size: '3MB', date: '2023-05-01' },
  ]
}
