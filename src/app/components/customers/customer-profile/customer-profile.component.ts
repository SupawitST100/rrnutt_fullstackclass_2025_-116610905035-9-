import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { Customer, MemberTier } from '../../../models/customer.model';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, DatePipe, TitleCasePipe],
  templateUrl: './customer-profile.component.html',
  styleUrl: './customer-profile.component.css',
})
export class CustomerProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private customerService = inject(CustomerService);

  customer: Customer | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? 'c001';
    this.customerService.getById(id).subscribe({
      next: (data) => { this.customer = data; this.loading = false; },
      error: (err) => { this.error = err.message; this.loading = false; },
    });
  }

  getTierClass(tier: MemberTier): string {
    return `tier-${tier}`;
  }

  getTierIcon(tier: MemberTier): string {
    const icons: Record<MemberTier, string> = {
      bronze: '🥉', silver: '🥈', gold: '🥇', platinum: '💎',
    };
    return icons[tier];
  }

  getInitials(customer: Customer): string {
    return `${customer.firstName[0]}${customer.lastName[0]}`.toUpperCase();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency', currency: 'THB', maximumFractionDigits: 0,
    }).format(amount);
  }
}
