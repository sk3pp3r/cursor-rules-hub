#!/usr/bin/env python3
"""
Script to extract all .cursorrules files from both repositories and create a JSON database
"""

import os
import json
import re
from pathlib import Path
from typing import Dict, List, Any
import hashlib

def validate_path(base_path: str, target_path: str) -> bool:
    """
    Validate that target_path is within base_path to prevent path traversal attacks.
    Returns True if path is safe, False otherwise.
    """
    try:
        # Resolve both paths to absolute paths
        base_abs = os.path.abspath(base_path)
        target_abs = os.path.abspath(target_path)
        
        # Check if target path starts with base path
        return target_abs.startswith(base_abs)
    except (OSError, ValueError):
        return False

def safe_read_file(file_path: str, base_path: str) -> str:
    """
    Safely read a file with path validation.
    """
    if not validate_path(base_path, file_path):
        raise ValueError(f"Path traversal attempt detected: {file_path}")
    
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

def extract_metadata_from_readme(readme_path: str, base_path: str = None) -> Dict[str, Any]:
    """Extract metadata from README.md file with security validation"""
    if base_path is None:
        base_path = os.getcwd()
    
    if not validate_path(base_path, readme_path):
        print(f"Security: Rejected path traversal attempt: {readme_path}")
        return {}
    
    if not os.path.exists(readme_path):
        return {}
    
    try:
        content = safe_read_file(readme_path, base_path)
        
        metadata = {}
        
        # Extract title (first heading)
        title_match = re.search(r'^#\s+(.+)', content, re.MULTILINE)
        if title_match:
            metadata['title'] = title_match.group(1).strip()
        
        # Extract description (first paragraph after title)
        desc_match = re.search(r'^#\s+.+\n\n(.+?)(?:\n\n|\n#|\Z)', content, re.MULTILINE | re.DOTALL)
        if desc_match:
            metadata['description'] = desc_match.group(1).strip()
        
        # Extract author if mentioned
        author_match = re.search(r'(?:author|created by|by)\s*:?\s*([^\n]+)', content, re.IGNORECASE)
        if author_match:
            metadata['author'] = author_match.group(1).strip()
        
        return metadata
    except Exception as e:
        print(f"Error reading README at {readme_path}: {e}")
        return {}

def categorize_rule(rule_name: str, content: str) -> List[str]:
    """Categorize a rule based on its name and content"""
    categories = []
    
    # Frontend frameworks
    frontend_frameworks = ['react', 'vue', 'angular', 'svelte', 'solid', 'next', 'nuxt', 'astro', 'qwik']
    if any(fw in rule_name.lower() for fw in frontend_frameworks):
        categories.append('Frontend')
    
    # Backend frameworks
    backend_frameworks = ['fastapi', 'django', 'flask', 'express', 'nestjs', 'laravel', 'rails', 'spring']
    if any(fw in rule_name.lower() for fw in backend_frameworks):
        categories.append('Backend')
    
    # Languages
    languages = ['typescript', 'javascript', 'python', 'go', 'java', 'php', 'c++', 'rust', 'kotlin', 'swift']
    for lang in languages:
        if lang in rule_name.lower():
            categories.append(f'Language-{lang.title()}')
    
    # Technologies
    technologies = ['docker', 'kubernetes', 'graphql', 'mongodb', 'postgresql', 'redis', 'aws', 'gcp', 'azure']
    for tech in technologies:
        if tech in rule_name.lower():
            categories.append(f'Technology-{tech.upper()}')
    
    # Testing
    testing_frameworks = ['jest', 'cypress', 'playwright', 'vitest', 'test']
    if any(fw in rule_name.lower() for fw in testing_frameworks):
        categories.append('Testing')
    
    # Mobile
    mobile_keywords = ['react-native', 'expo', 'flutter', 'android', 'ios', 'mobile']
    if any(kw in rule_name.lower() for kw in mobile_keywords):
        categories.append('Mobile')
    
    # DevOps
    devops_keywords = ['docker', 'kubernetes', 'ci', 'cd', 'deployment', 'devops', 'linux', 'nginx']
    if any(kw in rule_name.lower() for kw in devops_keywords):
        categories.append('DevOps')
    
    # CSS/Styling
    css_keywords = ['tailwind', 'css', 'styled-components', 'chakra', 'material-ui', 'bootstrap']
    if any(kw in rule_name.lower() for kw in css_keywords):
        categories.append('Styling')
    
    # AI/ML
    ai_keywords = ['llm', 'ai', 'ml', 'pytorch', 'tensorflow', 'scikit-learn', 'pandas']
    if any(kw in rule_name.lower() for kw in ai_keywords):
        categories.append('AI/ML')
    
    # Blockchain
    blockchain_keywords = ['solidity', 'blockchain', 'web3', 'ethereum']
    if any(kw in rule_name.lower() for kw in blockchain_keywords):
        categories.append('Blockchain')
    
    # If no categories found, mark as "Other"
    if not categories:
        categories = ['Other']
    
    return categories

def extract_tags_from_content(content: str) -> List[str]:
    """Extract relevant tags from rule content"""
    tags = []
    
    # Common technology tags
    tech_patterns = [
        r'typescript', r'javascript', r'react', r'vue', r'angular', r'python', r'fastapi',
        r'django', r'flask', r'nodejs', r'express', r'nextjs', r'tailwind', r'mongodb',
        r'postgresql', r'redis', r'docker', r'kubernetes', r'aws', r'gcp', r'azure'
    ]
    
    content_lower = content.lower()
    for pattern in tech_patterns:
        if re.search(pattern, content_lower):
            tags.append(pattern.replace('r\'', '').replace('\'', ''))
    
    # Remove duplicates and limit to 10 tags
    return list(set(tags))[:10]

def extract_rules_from_repo(repo_path: str, repo_name: str) -> List[Dict[str, Any]]:
    """Extract all rules from a repository"""
    rules = []
    rules_dir = os.path.join(repo_path, 'rules')
    
    if not os.path.exists(rules_dir):
        print(f"No rules directory found in {repo_path}")
        return rules
    
    for rule_folder in os.listdir(rules_dir):
        rule_folder_path = os.path.join(rules_dir, rule_folder)
        
        if not os.path.isdir(rule_folder_path):
            continue
        
        # Look for .cursorrules file
        cursorrules_path = os.path.join(rule_folder_path, '.cursorrules')
        if not os.path.exists(cursorrules_path):
            continue
        
        try:
            # Read the cursorrules content with security validation
            if not validate_path(repo_path, cursorrules_path):
                print(f"Security: Rejected path traversal attempt: {cursorrules_path}")
                continue
            
            content = safe_read_file(cursorrules_path, repo_path)
            
            # Extract metadata from README if exists
            readme_path = os.path.join(rule_folder_path, 'README.md')
            metadata = extract_metadata_from_readme(readme_path, repo_path)
            
            # Generate unique ID
            rule_id = hashlib.md5(f"{repo_name}_{rule_folder}".encode()).hexdigest()[:8]
            
            # Clean rule name
            rule_name = rule_folder.replace('-cursorrules-prompt-file', '').replace('-', ' ').title()
            
            # Create rule object
            rule = {
                'id': rule_id,
                'name': metadata.get('title', rule_name),
                'slug': rule_folder,
                'description': metadata.get('description', f"Cursor rules for {rule_name}"),
                'content': content,
                'author': metadata.get('author', 'Community'),
                'source_repo': repo_name,
                'categories': categorize_rule(rule_folder, content),
                'tags': extract_tags_from_content(content),
                'created_at': '2024-01-01',  # Default date
                'updated_at': '2024-01-01',  # Default date
                'rating': 4.5,  # Default rating
                'downloads': 0,  # Default downloads
                'favorites': 0,  # Default favorites
                'file_size': len(content),
                'language_support': []  # Will be populated based on content analysis
            }
            
            rules.append(rule)
            print(f"Extracted rule: {rule['name']}")
            
        except Exception as e:
            print(f"Error processing {rule_folder}: {e}")
            continue
    
    return rules

def main():
    """Main function to extract all rules and create JSON database"""
    all_rules = []
    
    # Extract from PatrickJS repository
    print("Extracting rules from PatrickJS repository...")
    patrick_rules = extract_rules_from_repo('temp_awesome_cursorrules', 'PatrickJS/awesome-cursorrules')
    all_rules.extend(patrick_rules)
    
    # Extract from sk3pp3r repository
    print("Extracting rules from sk3pp3r repository...")
    sk3pp3r_rules = extract_rules_from_repo('temp_sk3pp3r_rules', 'sk3pp3r/awesome-cursorrules')
    all_rules.extend(sk3pp3r_rules)
    
    # Create database structure
    database = {
        'meta': {
            'version': '1.0.0',
            'total_rules': len(all_rules),
            'last_updated': '2024-01-01',
            'sources': [
                'PatrickJS/awesome-cursorrules',
                'sk3pp3r/awesome-cursorrules'
            ]
        },
        'rules': all_rules,
        'categories': list(set(cat for rule in all_rules for cat in rule['categories'])),
        'tags': list(set(tag for rule in all_rules for tag in rule['tags']))
    }
    
    # Save to JSON file
    with open('cursor_rules_database.json', 'w', encoding='utf-8') as f:
        json.dump(database, f, indent=2, ensure_ascii=False)
    
    print(f"\nDatabase created successfully!")
    print(f"Total rules extracted: {len(all_rules)}")
    print(f"Categories found: {len(database['categories'])}")
    print(f"Tags found: {len(database['tags'])}")
    print(f"Database saved to: cursor_rules_database.json")

if __name__ == "__main__":
    main() 