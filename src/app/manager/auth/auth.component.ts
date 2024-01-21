import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ProgressSpinnerModule, ToastModule, HttpClientModule],
  providers: [MessageService, AuthService],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((d: any) => {
      if (!d.queueId || !d.pswd) {
        this.router.navigate(['/home']);
      } else {
        this.authService.authQueueManager(d.queueId, d.pswd).subscribe({
          next: (data) => {
            localStorage.setItem('queue-token', data.token);
            this.messageService.add({
              severity: 'success',
              detail: 'Authorized',
            });
            setTimeout(() => {
              this.router.navigate(['/manage/queue']);
            }, 2000);
          },
          error: (error) => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              detail: error.error.message,
            });
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 2000);
          },
        });
      }
    });
  }
}
