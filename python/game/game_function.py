import sys
import pygame
from bullet import Bullet
from alien import Alien


def check_events(ai_settings, screen, ship, bullets):
  for event in pygame.event.get():
    if event.type == pygame.QUIT:
      sys.exit()
    elif event.type == pygame.KEYDOWN:
      if event.key == pygame.K_q:
        sys.exit()
      else:
        check_keydown_events(event, ai_settings, screen, ship, bullets)
    elif event.type == pygame.KEYUP:
      check_keyup_events(event, ship)
  
    
def check_keydown_events(event, ai_settings, screen, ship, bullets):
  if event.key == pygame.K_SPACE:
    fire_bullet(ai_settings, screen,ship, bullets)
  elif event.key == pygame.K_RIGHT:
    #向右移动飞船
    ship.moving_right = True
    ship.moving_lefe = False
  elif event.key == pygame.K_LEFT:
    #向左移动飞船
    ship.moving_right = False
    ship.moving_left = True

def fire_bullet(ai_settings, screen, ship, bullets):
  if len(bullets) < ai_settings.bullets_allowed:
    current_bullet = Bullet(ai_settings, screen, ship)
    bullets.add(current_bullet)

def check_keyup_events(event, ship):
  if event.key == pygame.K_RIGHT:
    ship.moving_right = False
  if event.key == pygame.K_LEFT:
    #向左移动飞船
    ship.moving_left = False


def create_fleet(ai_settings, screen, ship, aliens):
  alien = Alien(ai_settings, screen)
  alien_width = alien.rect.width
  number_aliens_x = get_number_alien(ai_settings, alien_width)
  number_aliens_rows = get_number_rows(ai_settings, ship.rect.height, alien.rect.height)
  for row_number in range(number_aliens_rows):
    for alien_number in range(number_aliens_x):
      create_alien(ai_settings, screen, aliens, alien_number, row_number)

def get_number_alien(ai_settings, alien_width):
  available_space_x = ai_settings.screen_width - 2 * alien_width
  return int(available_space_x / (2 * alien_width))

def get_number_rows(ai_settings, ship_height, alien_height):
  available_space_y = ai_settings.screen_height - 3 * alien_height - ship_height
  number_rows = int(available_space_y / (2 * alien_height))
  return number_rows

def create_alien(ai_settings, screen, aliens, alien_number, row_number):
    alien = Alien(ai_settings, screen)
    alien_width = alien.rect.width
    alien.x = alien_width + 2 * alien_width * alien_number
    alien.rect.y = alien.rect.height + 2 * alien.rect.height * row_number
    alien.rect.x = alien.x
    aliens.add(alien)

def update_bullets(bullets):
  bullets.update()
  for bullet in bullets.copy():
      if bullet.rect.bottom <= 0:
        bullets.remove(bullet)

def update_screen(ai_setting, screen, ship, bullets, aliens):
  screen.fill(ai_setting.bg_color)
  ship.blitme()
  aliens.draw(screen)

  for bullet in bullets:
    bullet.draw_bullet()

  pygame.display.flip()